"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronLeft, Download, ExternalLink, RotateCcw } from "lucide-react";
import { trackMarketingEvent } from "@/lib/analytics";

type FormData = {
  website: string;
  sector: string;
  users: string;
  challenge: string;
  systems: string[];
};

type PageSpeedScan = {
  scores: { performance: number | null; accessibility: number | null; bestPractices: number | null; seo: number | null };
  metrics: { firstContentfulPaint: string | null; largestContentfulPaint: string | null; interactionToNextPaint: string | null; cumulativeLayoutShift: string | null; totalBlockingTime: string | null };
  fieldData: { largestContentfulPaint: FieldMetric | null; interactionToNextPaint: FieldMetric | null; cumulativeLayoutShift: FieldMetric | null };
  opportunities: AuditFinding[];
  diagnostics: AuditFinding[];
  passedChecks: AuditFinding[];
  finalUrl: string | null;
  fetchTime: string | null;
};

type AnalyticsSignal = { id: string; name: string; status: "observed_network" | "configured" | "waiting_for_consent"; evidence: string[] };
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
type ScanResult = { url: string; overallScore: number | null; mobile: PageSpeedScan; desktop: PageSpeedScan; evidence: SiteEvidence; priorities: PriorityFinding[]; cached?: boolean; cachedAt?: string };
type FieldMetric = { percentile: number; category: string | null };
type AuditFinding = { id: string; title: string; detail: string | null; score: number | null };

const initialForm: FormData = {
  website: "",
  sector: "",
  users: "",
  challenge: "",
  systems: [],
};

const systemOptions = ["CRM", "Analytics", "E-commerce", "Email / automation", "Customer support", "External forms", "None / not sure"];

function combinedLighthouseScore(scan: ScanResult | null) {
  return scan?.overallScore ?? null;
}

function hasValidUrl(value: string) {
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export default function ReadinessCheck() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [showResult, setShowResult] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [started, setStarted] = useState(false);
  const score = combinedLighthouseScore(scan);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => setForm((current) => ({ ...current, [key]: value }));
  const toggleSystem = (system: string) => {
    const withoutNone = system === "None / not sure" ? [] : form.systems.filter((item) => item !== "None / not sure");
    update("systems", withoutNone.includes(system) ? withoutNone.filter((item) => item !== system) : [...withoutNone, system]);
  };
  const canContinue = step === 1 ? hasValidUrl(form.website) && Boolean(form.sector) : Boolean(form.users) && Boolean(form.challenge);
  const startFitCheck = () => {
    if (started) return;
    setStarted(true);
    trackMarketingEvent({ event: "form_start", form_id: "fit_check" });
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canContinue) return;
    trackMarketingEvent({ event: "fit_check_step_complete", form_id: "fit_check", step_number: 2 });
    trackMarketingEvent({ event: "fit_check_scan_started", form_id: "fit_check" });
    setIsScanning(true);
    setScanError(null);
    try {
      const response = await fetch("/api/assessment/pagespeed", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: form.website }) });
      const data = await response.json() as ScanResult & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "We could not scan that website.");
      setScan(data);
      trackMarketingEvent({ event: "fit_check_scan_complete", form_id: "fit_check", cached: Boolean(data.cached), combined_site_score: combinedLighthouseScore(data), mobile_performance_score: data.mobile.scores.performance, desktop_performance_score: data.desktop.scores.performance });
      setShowResult(true);
    } catch (error) {
      setScanError(error instanceof Error ? error.message : "We could not scan that website.");
      trackMarketingEvent({ event: "form_error", form_id: "fit_check", error_type: "server_error" });
    } finally {
      setIsScanning(false);
    }
  };

  if (isScanning) return <ScanProgress website={form.website} />;

  if (showResult) {
    const systemsReady = form.systems.length >= 2 && !form.systems.includes("None / not sure");
    const level = score === null ? "Site score unavailable" : score >= 90 ? "Strong site health" : score >= 50 ? "Site health needs work" : "Site health needs attention";
    return (
      <section className="min-h-screen border-b border-foreground bg-background pt-16">
        <div className="crib-container grid gap-10 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:py-24">
          <div>
            <div className="crib-eyebrow">Your site performance check</div>
            <h1 className="crib-display mt-7 text-[clamp(56px,8vw,108px)]">{level}.</h1>
            <p className="mt-7 max-w-md text-[17px] leading-relaxed text-(--text-2)">This is the equal-weight average of every available mobile and desktop Lighthouse score across performance, accessibility, best practices, and SEO. Higher is better. It does not grade your business or decide whether you are a fit for CRIB.</p>
          </div>
          <div className="crib-card shadow-(--shadow-md)">
            <div className="grid border-b border-border sm:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-primary p-8 text-white sm:p-10">
                <div className="crib-mono text-white/70">Combined site score</div>
                <div className="mt-5 font-display text-[108px] leading-none">{score ?? "—"}</div>
                <div className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-white/80">out of 100</div>
              </div>
              <div className="p-8 sm:p-10">
                <div className="crib-mono text-(--text-3)">Submitted site</div>
                <a className="mt-3 flex items-center gap-2 break-all text-lg font-medium hover:text-primary" href={form.website.includes("://") ? form.website : `https://${form.website}`} target="_blank" rel="noreferrer">
                  {form.website}<ExternalLink className="h-4 w-4 shrink-0" />
                </a>
                <div className="mt-8 border-t border-border pt-5 text-sm text-(--text-2)">{form.sector} · {form.users} users</div>
              </div>
            </div>
            <div className="grid gap-px bg-border md:grid-cols-3">
              <Finding title="Business priority" ready={Boolean(form.challenge)} text={form.challenge || "Clarify the immediate priority."} />
              <Finding title="Measurement" ready={scan?.evidence.measurementStatus === "Strong" || scan?.evidence.measurementStatus === "Partial"} text={scan ? `${scan.evidence.measurementStatus} readiness based on observed implementation signals.` : "Measurement evidence unavailable."} />
              <Finding title="Operating context" ready={systemsReady} text={systemsReady ? "Recommendations account for the systems already in use." : "Map the essential operating systems before expanding the stack."} />
            </div>
            {scan && <div className="border-t border-border p-8 sm:p-10">
              <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="crib-mono text-(--text-3)">{scan.cached ? "Recent site scan" : "Live site scan"}</div><h2 className="crib-display mt-2 text-4xl">The evidence.</h2></div><div className="font-mono text-xs uppercase tracking-[0.08em] text-(--text-2)">Google PageSpeed Insights{scan.cached ? " · cached for up to 1 hour" : ""}</div></div>
              <div className="mt-7 grid gap-px border border-border bg-border sm:grid-cols-4">
                <Metric label="Mobile performance" value={scan.mobile.scores.performance} suffix="/100" />
                <Metric label="Mobile accessibility" value={scan.mobile.scores.accessibility} suffix="/100" />
                <Metric label="Mobile best practices" value={scan.mobile.scores.bestPractices} suffix="/100" />
                <Metric label="Mobile SEO" value={scan.mobile.scores.seo} suffix="/100" />
                <Metric label="Desktop performance" value={scan.desktop.scores.performance} suffix="/100" />
                <Metric label="Desktop accessibility" value={scan.desktop.scores.accessibility} suffix="/100" />
                <Metric label="Desktop best practices" value={scan.desktop.scores.bestPractices} suffix="/100" />
                <Metric label="Desktop SEO" value={scan.desktop.scores.seo} suffix="/100" />
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Detail label="Largest contentful paint" value={scan.mobile.metrics.largestContentfulPaint} />
                <Detail label="Interaction to next paint" value={scan.mobile.metrics.interactionToNextPaint} />
                <Detail label="Cumulative layout shift" value={scan.mobile.metrics.cumulativeLayoutShift} />
              </div>
              <div className="mt-7 grid gap-5 border-t border-border pt-8">
                <MeasurementEvidence evidence={scan.evidence} />
                <PriorityEvidence priorities={scan.priorities} />
                <EvidenceGroup title="Performance opportunities" empty="No high-priority performance opportunities were returned." findings={scan.mobile.opportunities} />
                <EvidenceGroup title="Technical diagnostics" empty="No technical diagnostics were returned." findings={scan.mobile.diagnostics} />
                <EvidenceGroup title="Checks passed" empty="No completed checks were returned." findings={scan.mobile.passedChecks} />
                <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
                  <FieldData label="Real-user LCP" metric={scan.mobile.fieldData.largestContentfulPaint} kind="ms" />
                  <FieldData label="Real-user INP" metric={scan.mobile.fieldData.interactionToNextPaint} kind="ms" />
                  <FieldData label="Real-user CLS" metric={scan.mobile.fieldData.cumulativeLayoutShift} kind="cls" />
                </div>
              </div>
            </div>}
              <div className="flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <p className="max-w-md text-sm text-(--text-2)">The one-page PDF carries the same score breakdown, context, measurement evidence, priorities, opportunities, diagnostics, and passed checks shown here.</p>
              <div className="flex flex-wrap gap-3">{scan && <button type="button" onClick={async () => { const { downloadFitReport } = await import("@/lib/fit-check/report-pdf"); await downloadFitReport({ website: scan.url, finalUrl: scan.mobile.finalUrl ?? scan.url, generatedAt: new Date(scan.cachedAt ?? Date.now()).toLocaleString(), cached: Boolean(scan.cached), score, context: { sector: form.sector, users: form.users, priority: form.challenge, systems: form.systems }, mobile: scan.mobile, desktop: scan.desktop, evidence: scan.evidence, priorities: scan.priorities }); trackMarketingEvent({ event: "fit_check_report_downloaded", form_id: "fit_check", cached: Boolean(scan.cached) }); }} className="crib-button-secondary"><Download className="h-4 w-4" /> Download one-page PDF</button>}<Link href="/contact" className="crib-button-primary shrink-0">Book a working session <ArrowRight className="h-4 w-4" /></Link></div>
            </div>
          </div>
          <button type="button" onClick={() => { setShowResult(false); setStep(1); }} className="crib-button-ghost w-fit"><RotateCcw className="h-4 w-4" /> Start again</button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen border-b border-foreground bg-background pt-16">
      <div className="crib-container grid gap-12 py-16 lg:grid-cols-[0.75fr_1.25fr] lg:py-24">
        <div>
          <div className="crib-eyebrow">2-minute site performance check</div>
          <h1 className="crib-display mt-7 max-w-[7em] text-[clamp(56px,8vw,108px)]">Find your next move.</h1>
          <p className="mt-7 max-w-md text-[17px] leading-relaxed text-(--text-2)">Tell us a little about your business. We’ll measure mobile and desktop site health, inspect the implementation signals, and show the most valuable next move.</p>
          <div className="mt-10 hidden border-t border-foreground pt-5 lg:block">
            <div className="crib-mono text-(--text-3)">What this covers</div>
            <p className="mt-3 max-w-sm text-sm text-(--text-2)">PageSpeed performance, experience quality, measurement readiness, and your operating context.</p>
          </div>
        </div>
        <form onSubmit={submit} className="crib-card shadow-(--shadow-md)">
          <div className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-8">
            <div className="crib-mono text-(--text-3)">Step 0{step} / 02</div>
            <div className="flex gap-2" aria-label={`Step ${step} of 2`}><span className={`h-2 w-10 ${step >= 1 ? "bg-primary" : "bg-border"}`} /><span className={`h-2 w-10 ${step >= 2 ? "bg-primary" : "bg-border"}`} /></div>
          </div>
          <div className="p-6 sm:p-8">
            {step === 1 ? <>
              <h2 className="crib-display text-4xl">Start with the business.</h2>
              <div className="mt-8 grid gap-6">
                <Field label="Website URL" hint="We’ll use this for the deeper assessment."><input className="crib-input" value={form.website} onFocus={startFitCheck} onChange={(e) => update("website", e.target.value)} placeholder="yourcompany.com" inputMode="url" required /></Field>
                <Field label="What sector are you in?"><select className="crib-input" value={form.sector} onFocus={startFitCheck} onChange={(e) => update("sector", e.target.value)} required><option value="">Choose a sector</option><option>Professional services</option><option>Government / public sector</option><option>Nonprofit / social impact</option><option>Healthcare</option><option>Education</option><option>Financial services</option><option>Real estate / construction</option><option>Retail / e-commerce</option><option>Hospitality / travel</option><option>Media / arts / culture</option><option>Manufacturing</option><option>Technology / SaaS</option><option>Other</option></select></Field>
              </div>
            </> : <>
              <h2 className="crib-display text-4xl">Now the operating context.</h2>
              <div className="mt-8 grid gap-6">
                <Field label="Estimated active users / customers"><select className="crib-input" value={form.users} onChange={(e) => update("users", e.target.value)} required><option value="">Choose a range</option><option>Under 100</option><option>100–1,000</option><option>1,000–10,000</option><option>10,000+</option></select></Field>
                <Field label="What would make the biggest difference right now?"><select className="crib-input" value={form.challenge} onChange={(e) => update("challenge", e.target.value)} required><option value="">Choose the closest fit</option><option>Get clearer on the growth opportunity</option><option>Improve conversion or customer experience</option><option>Connect fragmented systems</option><option>Scale a working offer</option></select></Field>
                <Field label="Which systems are already in use?" hint="Select all that apply."><div className="flex flex-wrap gap-2">{systemOptions.map((system) => <button key={system} type="button" onClick={() => toggleSystem(system)} className={`border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.06em] transition ${form.systems.includes(system) ? "border-primary bg-primary text-white" : "border-border bg-background text-(--text-2) hover:border-foreground"}`}>{form.systems.includes(system) && <Check className="mr-1.5 inline h-3.5 w-3.5" />}{system}</button>)}</div></Field>
              </div>
            </>}
          </div>
          <div className="flex items-center justify-between border-t border-border bg-(--neutral-25) p-6 sm:px-8">
            {step === 2 ? <button type="button" className="crib-button-ghost" onClick={() => setStep(1)}><ChevronLeft className="h-4 w-4" /> Back</button> : <div />}
            {step === 1 ? <button type="button" className="crib-button-primary" onClick={() => { if (canContinue) { trackMarketingEvent({ event: "fit_check_step_complete", form_id: "fit_check", step_number: 1 }); setStep(2); } }} disabled={!canContinue}>Continue <ArrowRight className="h-4 w-4" /></button> : <button type="submit" className="crib-button-primary" disabled={!canContinue || isScanning}>{isScanning ? "Scanning site…" : "See my snapshot"} <ArrowRight className="h-4 w-4" /></button>}
          </div>
          {scanError && <p className="border-t border-border bg-(--danger-50) px-6 py-3 text-sm text-(--danger-600) sm:px-8">{scanError}</p>}
        </form>
      </div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className="crib-mono text-(--text-2)">{label}</span>{hint && <span className="mt-1 block text-xs text-(--text-3)">{hint}</span>}<div className="mt-2">{children}</div></label>;
}

function Finding({ title, ready, text }: { title: string; ready: boolean; text: string }) {
  return <div className="bg-background p-6"><div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-(--text-2)"><span className={`h-2 w-2 rounded-full ${ready ? "bg-(--success-500)" : "bg-(--warn-500)"}`} />{title}</div><p className="mt-4 text-sm leading-relaxed text-(--text-2)">{text}</p></div>;
}

function Metric({ label, value, suffix }: { label: string; value: number | null; suffix: string }) {
  return <div className="bg-background p-5"><div className="crib-mono text-(--text-3)">{label}</div><div className="mt-3 font-display text-4xl">{value ?? "—"}<span className="ml-1 font-mono text-xs text-(--text-3)">{value === null ? "" : suffix}</span></div></div>;
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return <div className="border-t border-foreground pt-3"><div className="crib-mono text-(--text-3)">{label}</div><div className="mt-2 text-lg font-medium">{value ?? "Not available"}</div></div>;
}

function EvidenceGroup({ title, empty, findings }: { title: string; empty: string; findings: AuditFinding[] }) {
  return <div><div className="crib-mono text-(--text-3)">{title}</div>{findings.length ? <div className="mt-3 grid gap-px border border-border bg-border sm:grid-cols-2">{findings.map((finding) => <div key={finding.id} className="bg-background p-4"><div className="font-medium">{finding.title}</div>{finding.detail && <div className="mt-1 text-sm text-(--text-2)">{finding.detail}</div>}</div>)}</div> : <p className="mt-2 text-sm text-(--text-2)">{empty}</p>}</div>;
}

function FieldData({ label, metric, kind }: { label: string; metric: FieldMetric | null; kind: "ms" | "cls" }) {
  const value = metric ? (kind === "ms" ? `${(metric.percentile / 1000).toFixed(1)} s` : (metric.percentile / 100).toFixed(3)) : "Not available";
  return <div className="border-t border-foreground pt-3"><div className="crib-mono text-(--text-3)">{label}</div><div className="mt-2 text-lg font-medium">{value}</div>{metric?.category && <div className="mt-1 text-xs text-(--text-3)">{metric.category.replace(/_/g, " ").toLowerCase()}</div>}</div>;
}

function MeasurementEvidence({ evidence }: { evidence: SiteEvidence }) {
  return <div>
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><div className="crib-mono text-(--text-3)">Measurement implementation</div><div className="mt-2 text-2xl font-medium">{evidence.measurementStatus}</div></div>
      <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-(--text-3)">{evidence.availability === "complete" ? "HTML + headers + rendered network" : "Partial evidence available"}</div>
    </div>
    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-(--text-2)">We inspect configuration in the initial HTML and compare it with requests observed during Lighthouse&apos;s rendered page load. “Not observed” does not prove a tool is absent; consent and runtime conditions can suppress collection.</p>
    <div className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {evidence.analytics.length ? evidence.analytics.map((signal) => <div key={signal.id} className="bg-background p-4"><div className="font-medium">{signal.name}</div><div className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-primary">{signal.status.replaceAll("_", " ")}</div><div className="mt-2 text-xs text-(--text-3)">{signal.evidence.join(" · ")}</div></div>) : <div className="bg-background p-4 text-sm text-(--text-2)">No supported analytics platform was observed.</div>}
      <div className="bg-background p-4"><div className="font-medium">dataLayer</div><div className="mt-1 text-sm text-(--text-2)">{evidence.dataLayer.present ? `Present · ${evidence.dataLayer.pushCount} static push${evidence.dataLayer.pushCount === 1 ? "" : "es"}${evidence.dataLayer.eventNames.length ? ` · Events: ${evidence.dataLayer.eventNames.join(", ")}` : ""}` : "Not observed in initial HTML"}</div></div>
      {evidence.consentPlatform && <div className="bg-background p-4"><div className="font-medium">Consent platform</div><div className="mt-1 text-sm text-(--text-2)">{evidence.consentPlatform}</div></div>}
      <div className="bg-background p-4"><div className="font-medium">Technology signals</div><div className="mt-1 text-sm text-(--text-2)">{evidence.technologies.join(", ") || "Not observed"}</div></div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">{evidence.headers.map((header) => <span key={header.name} title={header.value} className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.05em] ${header.present ? "border-(--success-500) text-(--success-500)" : "border-border text-(--text-3)"}`}>{header.name}: {header.present ? "present" : "not observed"}</span>)}</div>
    <div className="mt-4 grid gap-1">{evidence.notes.map((note) => <p key={note} className="text-xs text-(--text-3)">{note}</p>)}</div>
  </div>;
}

function PriorityEvidence({ priorities }: { priorities: PriorityFinding[] }) {
  return <div className="border-t border-border pt-7"><div className="crib-mono text-(--text-3)">Highest-value next moves</div>{priorities.length ? <div className="mt-3 grid gap-px border border-border bg-border">{priorities.map((finding, index) => <div key={`${finding.title}-${index}`} className="grid gap-3 bg-background p-5 md:grid-cols-[44px_1fr]"><div className="font-mono text-xs text-primary">0{index + 1}</div><div><div className="flex flex-wrap items-center gap-2"><div className="font-medium">{finding.title}</div><span className="font-mono text-[9px] uppercase tracking-[0.06em] text-(--text-3)">{finding.priority}</span></div><p className="mt-2 text-sm text-(--text-2)">{finding.why}</p><p className="mt-2 text-sm"><span className="font-medium">Evidence:</span> {finding.evidence}</p><p className="mt-1 text-sm text-primary"><span className="font-medium">Next:</span> {finding.action}</p></div></div>)}</div> : <p className="mt-2 text-sm text-(--text-2)">No prioritized findings were returned.</p>}</div>;
}

function ScanProgress({ website }: { website: string }) {
  const [stage, setStage] = useState(0);
  const stages = ["Checking the public URL", "Measuring mobile and desktop", "Inspecting analytics and headers", "Building your performance report"];
  useEffect(() => { const timer = window.setInterval(() => setStage((current) => Math.min(current + 1, stages.length - 1)), 1800); return () => window.clearInterval(timer); }, [stages.length]);
  return <section className="min-h-screen border-b border-foreground bg-background pt-16"><div className="crib-container grid min-h-[calc(100vh-64px)] place-items-center py-16"><div className="w-full max-w-2xl text-center"><div className="crib-eyebrow justify-center">Site performance check</div><div className="mx-auto mt-8 grid h-24 w-24 place-items-center rounded-full border-4 border-(--neutral-200) border-t-primary animate-spin"><div className="h-14 w-14 rounded-full border border-primary/30" /></div><h1 className="crib-display mt-10 text-[clamp(52px,8vw,88px)]">Reading the signals.</h1><p className="mx-auto mt-5 max-w-lg text-[17px] text-(--text-2)">We’re scanning <span className="font-medium text-foreground">{website}</span> and assembling your report.</p><div className="mx-auto mt-10 max-w-md border-y border-foreground text-left">{stages.map((item, index) => <div key={item} className="flex items-center gap-3 border-b border-border py-4 last:border-b-0"><span className={`grid h-6 w-6 place-items-center rounded-full border font-mono text-[10px] ${index < stage ? "border-primary bg-primary text-white" : index === stage ? "border-primary text-primary" : "border-border text-(--text-3)"}`}>{index < stage ? "✓" : `0${index + 1}`}</span><span className={index <= stage ? "text-foreground" : "text-(--text-3)"}>{item}</span>{index === stage && <span className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />}</div>)}</div><p className="mt-7 font-mono text-[10px] uppercase tracking-[0.08em] text-(--text-3)">Usually ready in 15–45 seconds</p></div></div></section>;
}
