import { lookup } from "node:dns/promises";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/providers/supabase/server-client";

export const runtime = "nodejs";

const PAGE_SPEED_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const CATEGORIES = ["PERFORMANCE", "ACCESSIBILITY", "BEST_PRACTICES", "SEO"] as const;
const MAX_HTML_BYTES = 1_500_000;

type LighthouseAudit = {
  score?: number | null;
  title?: string;
  description?: string;
  numericValue?: number;
  displayValue?: string;
  scoreDisplayMode?: string;
  details?: { type?: string; items?: Array<Record<string, unknown>> };
};

type PageSpeedResponse = {
  lighthouseResult?: {
    categories?: Record<string, { score?: number | null }>;
    audits?: Record<string, LighthouseAudit>;
    finalUrl?: string;
    fetchTime?: string;
  };
  loadingExperience?: { metrics?: Record<string, { percentile?: number; category?: string }> };
};

type AuditFinding = { id: string; title: string; detail: string | null; score: number | null };
type AnalyticsStatus = "observed_network" | "configured" | "waiting_for_consent";
type AnalyticsSignal = { id: string; name: string; status: AnalyticsStatus; evidence: string[] };
type HeaderSignal = { name: string; value: string; present: boolean };
type PriorityFinding = { title: string; why: string; evidence: string; action: string; priority: "high" | "medium" };
type SiteEvidence = {
  availability: "complete" | "partial";
  measurementStatus: "Strong" | "Partial" | "Limited" | "Not observed";
  analytics: AnalyticsSignal[];
  dataLayer: { present: boolean; pushCount: number; eventNames: string[] };
  consentPlatform: string | null;
  headers: HeaderSignal[];
  technologies: string[];
  notes: string[];
};

type ScanSummary = ReturnType<typeof summary>;
type ScanResult = { url: string; overallScore: number | null; mobile: ScanSummary; desktop: ScanSummary; evidence: SiteEvidence; priorities: PriorityFinding[] };
type CacheEntry = { result: ScanResult; createdAt: string; expiresAt: number };

const memoryCache = globalThis as typeof globalThis & {
  pagespeedDomainCache?: Map<string, CacheEntry>;
  pagespeedDomainInFlight?: Map<string, Promise<ScanResult>>;
};
const fallbackCache = memoryCache.pagespeedDomainCache ?? new Map<string, CacheEntry>();
const inFlightScans = memoryCache.pagespeedDomainInFlight ?? new Map<string, Promise<ScanResult>>();
memoryCache.pagespeedDomainCache = fallbackCache;
memoryCache.pagespeedDomainInFlight = inFlightScans;

function cacheTtlMs() {
  const configured = Number(process.env.FIT_CHECK_CACHE_TTL_MS);
  if (Number.isFinite(configured) && configured >= 60_000) return configured;
  return 60 * 60 * 1000;
}

const analyticsDetectors = [
  { id: "gtm", name: "Google Tag Manager", html: /googletagmanager\.com\/(?:gtm\.js|ns\.html)|GTM-[A-Z0-9]+/i, network: /googletagmanager\.com\/(?:gtm\.js|ns\.html)/i },
  { id: "ga4", name: "Google Analytics", html: /googletagmanager\.com\/gtag\/js|G-[A-Z0-9]{5,}|UA-\d+-\d+/i, network: /google-analytics\.com\/(?:g\/collect|collect)|googletagmanager\.com\/gtag\/js/i },
  { id: "adobe", name: "Adobe Analytics", html: /adobedtm\.com|omtrdc\.net|AppMeasurement/i, network: /adobedtm\.com|omtrdc\.net/i },
  { id: "segment", name: "Segment", html: /cdn\.segment\.com|analytics\.load\s*\(/i, network: /segment\.(?:com|io)/i },
  { id: "meta", name: "Meta Pixel", html: /connect\.facebook\.net\/.+fbevents\.js|fbq\s*\(/i, network: /facebook\.com\/tr|connect\.facebook\.net\/.+fbevents\.js/i },
  { id: "hubspot", name: "HubSpot", html: /js\.hs-scripts\.com|_hsq\s*=/i, network: /(?:hs-scripts|hs-analytics|hubspot)\.com/i },
  { id: "matomo", name: "Matomo", html: /matomo\.js|_paq\s*=/i, network: /matomo\.(?:js|php)/i },
  { id: "plausible", name: "Plausible", html: /plausible\.io\/js\/script/i, network: /plausible\.io\/(?:js|api\/event)/i },
  { id: "mixpanel", name: "Mixpanel", html: /cdn\.mxpnl\.com|mixpanel\.init/i, network: /(?:mxpnl|mixpanel)\.com/i },
  { id: "clarity", name: "Microsoft Clarity", html: /clarity\.ms\/tag|clarity\s*\(/i, network: /clarity\.ms/i },
  { id: "hotjar", name: "Hotjar", html: /static\.hotjar\.com|hj\s*\(/i, network: /hotjar\.com/i },
] as const;

const consentDetectors = [
  ["OneTrust", /cdn\.cookielaw\.org|OptanonWrapper/i],
  ["Cookiebot", /consent\.cookiebot\.com|CookieConsent/i],
  ["TrustArc", /trustarc\.com|truste\.com/i],
  ["Osano", /cmp\.osano\.com|osano\.com/i],
  ["Didomi", /sdk\.privacy-center\.org|didomi/i],
] as const;

function isPrivateAddress(address: string) {
  const normalized = address.toLowerCase();
  if (normalized === "::1" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:")) return true;
  const parts = normalized.split(".").map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) return false;
  return parts[0] === 10 || parts[0] === 127 || parts[0] === 0 || (parts[0] === 169 && parts[1] === 254) || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168);
}

async function normalizePublicUrl(value: unknown) {
  if (typeof value !== "string" || value.length > 2048) throw new Error("Enter a valid website URL.");
  const url = new URL(value.includes("://") ? value : `https://${value}`);
  if (!/^https?:$/.test(url.protocol) || !url.hostname || url.username || url.password) throw new Error("Enter a public HTTP or HTTPS website URL.");
  if (url.port && !["80", "443"].includes(url.port)) throw new Error("Use a standard public website URL without a custom port.");
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) throw new Error("Please enter a public website URL.");
  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) throw new Error("Please enter a public website URL.");
  return { url: url.toString(), domain: hostname.replace(/^www\./, "") };
}

function toScore(value?: number | null) {
  return typeof value === "number" ? Math.round(value * 100) : null;
}

function auditItems(audit: LighthouseAudit | undefined) {
  return Array.isArray(audit?.details?.items) ? audit.details.items : [];
}

function summary(data: PageSpeedResponse) {
  const audits = data.lighthouseResult?.audits ?? {};
  const categories = data.lighthouseResult?.categories ?? {};
  return {
    finalUrl: data.lighthouseResult?.finalUrl ?? null,
    fetchTime: data.lighthouseResult?.fetchTime ?? null,
    scores: {
      performance: toScore(categories.performance?.score),
      accessibility: toScore(categories.accessibility?.score),
      bestPractices: toScore(categories["best-practices"]?.score),
      seo: toScore(categories.seo?.score),
    },
    metrics: {
      firstContentfulPaint: audits["first-contentful-paint"]?.displayValue ?? null,
      largestContentfulPaint: audits["largest-contentful-paint"]?.displayValue ?? null,
      interactionToNextPaint: audits["interaction-to-next-paint"]?.displayValue ?? null,
      cumulativeLayoutShift: audits["cumulative-layout-shift"]?.displayValue ?? null,
      totalBlockingTime: audits["total-blocking-time"]?.displayValue ?? null,
    },
    fieldData: {
      largestContentfulPaint: fieldMetric(data.loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS),
      interactionToNextPaint: fieldMetric(data.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT),
      cumulativeLayoutShift: fieldMetric(data.loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE),
    },
    opportunities: collectFindings(audits, "opportunity"),
    diagnostics: collectFindings(audits, "diagnostic"),
    passedChecks: Object.entries(audits).filter(([, audit]) => audit.score === 1 && audit.title && audit.scoreDisplayMode !== "notApplicable").slice(0, 8).map(([id, audit]) => ({ id, title: audit.title!, detail: audit.displayValue ?? null, score: audit.score ?? null })),
  };
}

function fieldMetric(metric?: { percentile?: number; category?: string }) {
  if (!metric || typeof metric.percentile !== "number") return null;
  return { percentile: metric.percentile, category: metric.category ?? null };
}

function collectFindings(audits: Record<string, LighthouseAudit> | undefined, type: "opportunity" | "diagnostic"): AuditFinding[] {
  return Object.entries(audits ?? {})
    .filter(([, audit]) => audit.details?.type === type && typeof audit.title === "string" && audit.score !== 1 && audit.scoreDisplayMode !== "notApplicable")
    .sort(([, a], [, b]) => (b.numericValue ?? 0) - (a.numericValue ?? 0))
    .slice(0, 8)
    .map(([id, audit]) => ({ id, title: audit.title!, detail: audit.displayValue ?? null, score: audit.score ?? null }));
}

async function fetchInitialPage(startUrl: string) {
  let currentUrl = startUrl;
  for (let redirect = 0; redirect <= 5; redirect += 1) {
    const normalized = await normalizePublicUrl(currentUrl);
    const response = await fetch(normalized.url, {
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
      headers: { "User-Agent": "CRIB-Site-Performance-Check/1.0" },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("The site returned an invalid redirect.");
      currentUrl = new URL(location, normalized.url).toString();
      continue;
    }
    const contentLength = Number(response.headers.get("content-length") ?? 0);
    if (contentLength > MAX_HTML_BYTES) throw new Error("The initial HTML response was too large to inspect safely.");
    const contentType = response.headers.get("content-type") ?? "";
    const html = contentType.includes("text/html") ? (await response.text()).slice(0, MAX_HTML_BYTES) : "";
    return { html, headers: response.headers, finalUrl: normalized.url };
  }
  throw new Error("The site redirected too many times.");
}

function getNetworkUrls(data: PageSpeedResponse) {
  return auditItems(data.lighthouseResult?.audits?.["network-requests"])
    .map((item) => typeof item.url === "string" ? item.url : "")
    .filter(Boolean);
}

function inspectEvidence(html: string, headers: Headers, networkUrls: string[], staticAvailable: boolean): SiteEvidence {
  const networkText = networkUrls.join("\n");
  const consentPlatform = consentDetectors.find(([, pattern]) => pattern.test(html) || pattern.test(networkText))?.[0] ?? null;
  const analytics = analyticsDetectors.flatMap((detector): AnalyticsSignal[] => {
    const configured = detector.html.test(html);
    const observed = detector.network.test(networkText);
    if (!configured && !observed) return [];
    const status: AnalyticsStatus = observed ? "observed_network" : consentPlatform ? "waiting_for_consent" : "configured";
    const evidence = [observed ? "Related request observed in Lighthouse's rendered network log" : "Configuration found in initial HTML"];
    return [{ id: detector.id, name: detector.name, status, evidence }];
  });
  const eventNames = [...html.matchAll(/dataLayer\.push\s*\(\s*\{[^}]{0,600}?event\s*:\s*["']([^"']+)["']/gi)].map((match) => match[1]).slice(0, 10);
  const pushCount = (html.match(/dataLayer\.push\s*\(/gi) ?? []).length;
  const dataLayerPresent = /(?:window\.)?dataLayer\s*=|dataLayer\.push\s*\(/i.test(html);
  const headerDefinitions = [
    ["Content Security Policy", "content-security-policy"],
    ["Strict Transport Security", "strict-transport-security"],
    ["Cache Control", "cache-control"],
    ["Content Encoding", "content-encoding"],
    ["Referrer Policy", "referrer-policy"],
    ["Permissions Policy", "permissions-policy"],
  ] as const;
  const headerSignals = headerDefinitions.map(([name, key]) => ({ name, value: headers.get(key) ?? "Not observed", present: headers.has(key) }));
  const technologies = [
    [/wp-content|wp-includes/i, "WordPress"],
    [/_next\/static/i, "Next.js"],
    [/cdn\.shopify\.com|Shopify\.theme/i, "Shopify"],
    [/static1\.squarespace\.com/i, "Squarespace"],
    [/static\.wixstatic\.com/i, "Wix"],
  ].filter(([pattern]) => (pattern as RegExp).test(html) || (pattern as RegExp).test(networkText)).map(([, name]) => name as string);
  const observedCount = analytics.filter((item) => item.status === "observed_network").length;
  const configuredCount = analytics.length - observedCount;
  const measurementStatus = observedCount > 0 && (dataLayerPresent || analytics.length > 1) ? "Strong" : observedCount > 0 ? "Partial" : configuredCount > 0 ? "Limited" : "Not observed";
  const notes = [
    !staticAvailable ? "Initial HTML and response headers were unavailable; rendered network evidence is still included." : "Initial HTML and response headers inspected.",
    networkUrls.length ? `${networkUrls.length} rendered network requests inspected from Lighthouse.` : "Rendered network request details were unavailable.",
    "Not observed does not prove a tool is absent; consent and runtime conditions can suppress requests.",
  ];
  return { availability: staticAvailable && networkUrls.length ? "complete" : "partial", measurementStatus, analytics, dataLayer: { present: dataLayerPresent, pushCount, eventNames }, consentPlatform, headers: headerSignals, technologies, notes };
}

function buildPriorities(mobile: ScanSummary, evidence: SiteEvidence): PriorityFinding[] {
  const priorities: PriorityFinding[] = [];
  for (const finding of [...mobile.opportunities, ...mobile.diagnostics].slice(0, 2)) {
    priorities.push({
      title: finding.title,
      why: "This issue contributes to the measured mobile experience and can affect engagement or conversion.",
      evidence: finding.detail ?? "Flagged by the mobile Lighthouse audit.",
      action: `Review the Lighthouse evidence for ${finding.title.toLowerCase()} and address the highest-impact instances first.`,
      priority: "high",
    });
  }
  if (evidence.measurementStatus === "Not observed" || evidence.measurementStatus === "Limited") {
    priorities.push({
      title: "Validate the measurement foundation",
      why: "Reliable decisions require confirmed analytics collection, consent behavior, and meaningful events.",
      evidence: evidence.analytics.length ? "Analytics configuration was found but no collection request was observed." : "No supported analytics platform was observed in HTML or the rendered network log.",
      action: "Verify the production tag, consent defaults, page-view collection, and priority conversion events in a live browser.",
      priority: "high",
    });
  }
  const missingSecurity = evidence.headers.filter((header) => !header.present && ["Content Security Policy", "Strict Transport Security"].includes(header.name));
  if (priorities.length < 3 && missingSecurity.length) {
    priorities.push({
      title: "Harden browser security signals",
      why: "Response policies reduce avoidable browser-side risk and clarify which third-party resources are permitted.",
      evidence: `${missingSecurity.map((item) => item.name).join(" and ")} ${missingSecurity.length === 1 ? "was" : "were"} not observed.`,
      action: "Confirm the policy at the CDN or origin, then deploy and test it in report-only mode before enforcement.",
      priority: "medium",
    });
  }
  return priorities.slice(0, 3);
}

function combinedLighthouseScore(mobile: ScanSummary, desktop: ScanSummary) {
  const values = [...Object.values(mobile.scores), ...Object.values(desktop.scores)].filter((value): value is number => typeof value === "number");
  return values.length ? Math.round(values.reduce((total, value) => total + value, 0) / values.length) : null;
}

async function getCachedResult(domain: string) {
  if (process.env.NODE_ENV === "development") return null;
  const now = Date.now();
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("pagespeed_domain_cache").select("result, created_at, expires_at").eq("domain", domain).gt("expires_at", new Date(now).toISOString()).maybeSingle();
    if (!error && data) {
      const result = data.result as ScanResult;
      if (result.evidence && result.priorities && "overallScore" in result) return { result, createdAt: data.created_at as string };
    }
    if (error) console.warn("PageSpeed shared cache read failed:", error.message);
  }
  const fallback = fallbackCache.get(domain);
  if (fallback?.result.evidence && "overallScore" in fallback.result && fallback.expiresAt > now) return { result: fallback.result, createdAt: fallback.createdAt };
  if (fallback) fallbackCache.delete(domain);
  return null;
}

async function cacheResult(domain: string, result: ScanResult) {
  if (process.env.NODE_ENV === "development") return;
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + cacheTtlMs()).toISOString();
  fallbackCache.set(domain, { result, createdAt, expiresAt: Date.parse(expiresAt) });
  const supabase = getSupabaseServerClient();
  if (!supabase) return;
  const { error } = await supabase.from("pagespeed_domain_cache").upsert({ domain, scanned_url: result.url, result, created_at: createdAt, expires_at: expiresAt });
  if (error) console.warn("PageSpeed shared cache write failed:", error.message);
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "The PageSpeed scanner is not configured yet." }, { status: 503 });

  try {
    const { url: rawUrl } = await request.json();
    const { url, domain } = await normalizePublicUrl(rawUrl);
    const cached = await getCachedResult(domain);
    if (cached) return NextResponse.json({ ...cached.result, cached: true, cachedAt: cached.createdAt });

    const useSingleFlight = process.env.NODE_ENV !== "development";
    let scanTask = useSingleFlight ? inFlightScans.get(domain) : undefined;
    const joinedExistingScan = Boolean(scanTask);
    if (!scanTask) {
      scanTask = (async () => {
        const [pageInspection, scans] = await Promise.all([
          fetchInitialPage(url).catch(() => null),
          Promise.all(["mobile", "desktop"].map(async (strategy) => {
            const params = new URLSearchParams({ url, key: apiKey, strategy });
            CATEGORIES.forEach((category) => params.append("category", category));
            const response = await fetch(`${PAGE_SPEED_ENDPOINT}?${params}`, { signal: AbortSignal.timeout(45_000), cache: "no-store" });
            if (!response.ok) throw new Error(`PageSpeed Insights could not scan this site (${response.status}).`);
            return [strategy, await response.json() as PageSpeedResponse] as const;
          })),
        ]);
        const mobileData = scans[0][1];
        const desktopData = scans[1][1];
        const mobile = summary(mobileData);
        const desktop = summary(desktopData);
        const evidence = inspectEvidence(pageInspection?.html ?? "", pageInspection?.headers ?? new Headers(), getNetworkUrls(mobileData), Boolean(pageInspection));
        const result: ScanResult = { url, overallScore: combinedLighthouseScore(mobile, desktop), mobile, desktop, evidence, priorities: buildPriorities(mobile, evidence) };
        await cacheResult(domain, result);
        return result;
      })();
      if (useSingleFlight) {
        inFlightScans.set(domain, scanTask);
        scanTask.then(() => inFlightScans.delete(domain), () => inFlightScans.delete(domain));
      }
    }
    const result = await scanTask;
    return NextResponse.json({ ...result, cached: joinedExistingScan, cachedAt: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not scan that website.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
