import { lookup } from "node:dns/promises";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/providers/supabase/server-client";

export const runtime = "nodejs";

const PAGE_SPEED_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const CATEGORIES = ["PERFORMANCE", "ACCESSIBILITY", "BEST_PRACTICES", "SEO"] as const;
const CACHE_TTL_MS = 60 * 60 * 1000;

type PageSpeedResponse = {
  lighthouseResult?: {
    categories?: Record<string, { score?: number | null }>;
    audits?: Record<string, { score?: number | null; title?: string; description?: string; numericValue?: number; displayValue?: string; scoreDisplayMode?: string; details?: { type?: string } }>;
    finalUrl?: string;
    fetchTime?: string;
  };
  loadingExperience?: { metrics?: Record<string, { percentile?: number; category?: string }> };
};

type AuditFinding = { id: string; title: string; detail: string | null; score: number | null };

type ScanSummary = ReturnType<typeof summary>;
type ScanResult = { url: string; mobile: ScanSummary; desktop: ScanSummary };
type CacheEntry = { result: ScanResult; createdAt: string; expiresAt: number };

const memoryCache = globalThis as typeof globalThis & { pagespeedDomainCache?: Map<string, CacheEntry> };
const fallbackCache = memoryCache.pagespeedDomainCache ?? new Map<string, CacheEntry>();
memoryCache.pagespeedDomainCache = fallbackCache;

function isPrivateAddress(address: string) {
  const normalized = address.toLowerCase();
  if (normalized === "::1" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:" )) return true;
  const parts = normalized.split(".").map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) return false;
  return parts[0] === 10 || parts[0] === 127 || parts[0] === 0 || (parts[0] === 169 && parts[1] === 254) || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168);
}

async function normalizePublicUrl(value: unknown) {
  if (typeof value !== "string" || value.length > 2048) throw new Error("Enter a valid website URL.");
  const url = new URL(value.includes("://") ? value : `https://${value}`);
  if (!/^https?:$/.test(url.protocol) || !url.hostname || url.username || url.password) throw new Error("Enter a public HTTP or HTTPS website URL.");
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) throw new Error("Please enter a public website URL.");
  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) throw new Error("Please enter a public website URL.");
  return { url: url.toString(), domain: hostname.replace(/^www\./, "") };
}

function toScore(value?: number | null) {
  return typeof value === "number" ? Math.round(value * 100) : null;
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

function collectFindings(audits: NonNullable<PageSpeedResponse["lighthouseResult"]>["audits"], type: "opportunity" | "diagnostic"): AuditFinding[] {
  return Object.entries(audits ?? {})
    .filter(([, audit]) => audit.details?.type === type && typeof audit.title === "string" && audit.score !== 1 && audit.scoreDisplayMode !== "notApplicable")
    .sort(([, a], [, b]) => (b.numericValue ?? 0) - (a.numericValue ?? 0))
    .slice(0, 8)
    .map(([id, audit]) => ({ id, title: audit.title!, detail: audit.displayValue ?? null, score: audit.score ?? null }));
}

async function getCachedResult(domain: string) {
  const now = Date.now();
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("pagespeed_domain_cache")
      .select("result, created_at, expires_at")
      .eq("domain", domain)
      .gt("expires_at", new Date(now).toISOString())
      .maybeSingle();
    if (!error && data) {
      return { result: data.result as ScanResult, createdAt: data.created_at as string };
    }
    if (error) console.warn("PageSpeed shared cache read failed:", error.message);
  }
  const fallback = fallbackCache.get(domain);
  if (fallback && fallback.expiresAt > now) return { result: fallback.result, createdAt: fallback.createdAt };
  if (fallback) fallbackCache.delete(domain);
  return null;
}

async function cacheResult(domain: string, result: ScanResult) {
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString();
  fallbackCache.set(domain, { result, createdAt, expiresAt: Date.parse(expiresAt) });
  const supabase = getSupabaseServerClient();
  if (!supabase) return;
  const { error } = await supabase.from("pagespeed_domain_cache").upsert({
    domain,
    scanned_url: result.url,
    result,
    created_at: createdAt,
    expires_at: expiresAt,
  });
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
    const scans = await Promise.all(["mobile", "desktop"].map(async (strategy) => {
      const params = new URLSearchParams({ url, key: apiKey, strategy });
      CATEGORIES.forEach((category) => params.append("category", category));
      const response = await fetch(`${PAGE_SPEED_ENDPOINT}?${params}`, { signal: AbortSignal.timeout(45_000), cache: "no-store" });
      if (!response.ok) throw new Error(`PageSpeed Insights could not scan this site (${response.status}).`);
      return [strategy, summary(await response.json() as PageSpeedResponse)] as const;
    }));
    const result = { url, mobile: scans[0][1], desktop: scans[1][1] };
    await cacheResult(domain, result);
    return NextResponse.json({ ...result, cached: false, cachedAt: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not scan that website.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
