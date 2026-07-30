"use client";

import { motion } from "framer-motion";

const stages = [
  {
    num: "1",
    title: "Intro call",
    timing: "30 minutes · free",
    body: "A straightforward conversation about your goals, your tools, and what's getting in the way. We ask more than we pitch. If we're not the right fit, we'll say so and point you somewhere useful.",
    outcome: "A clear read on whether this is worth pursuing — for both of us.",
  },
  {
    num: "2",
    title: "Fit & focus",
    timing: "One short follow-up",
    body: "We agree on the one growth question that matters most right now — more repeat customers, a report leadership can trust, a channel that isn't converting — and scope the diagnostic around it.",
    outcome: "A defined focus and a fixed scope, in writing, before anything is billed.",
  },
  {
    num: "3",
    title: "The diagnostic",
    timing: "2–3 weeks",
    body: "We interview your team, inventory your tools, trace the customer journey, and review the data and reports behind it. Everything is documented as we go — the findings are yours either way.",
    outcome: "The executive brief, system map, readiness snapshot, and 90-day plan.",
  },
  {
    num: "4",
    title: "Roadmap review",
    timing: "One working session",
    body: "We walk your leadership through the findings in plain language: what's solid, what's costing you, and what to do first. Immediate fixes are separated from bigger decisions so nothing gets oversold.",
    outcome: "An agreed first move — and honest sequencing for everything after it.",
  },
  {
    num: "5",
    title: "The first fix",
    timing: "Weeks, not months",
    body: "One tightly scoped sprint delivers the top priority: a reconnected tool, a trustworthy report, a rebuilt page or workflow. Tested with your real work, documented, and handed to a named owner on your team.",
    outcome: "A working improvement with before-and-after evidence.",
  },
  {
    num: "6",
    title: "Ongoing partnership",
    timing: "Monthly",
    body: "Once trust is earned, we stay on to keep the system healthy: monitoring data quality and integrations, maintaining the roadmap, and introducing new capabilities — including practical AI — when the foundation is ready.",
    outcome: "A monthly health brief, a living roadmap, and a quarterly strategy review.",
  },
];

export default function Timeline() {
  return (
    <section className="bg-[var(--surface-2)]">
      <div className="crib-container flex flex-col py-[72px]">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.45 }}
            className="grid grid-cols-[40px_1fr] gap-7"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--neutral-200)] bg-card text-[13px] font-bold text-primary shadow-sm">
                {stage.num}
              </div>
              {index < stages.length - 1 && (
                <div className="min-h-6 w-px flex-1 bg-[var(--neutral-200)]" />
              )}
            </div>
            <div className="pb-9">
              <div className="mb-2 flex flex-wrap items-baseline gap-3">
                <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-foreground">{stage.title}</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground">{stage.timing}</span>
              </div>
              <p className="mb-3.5 max-w-[44em] text-[15px] leading-relaxed text-balance text-[var(--text-2)]">{stage.body}</p>
              <div className="inline-flex max-w-[44em] items-start gap-2.5 rounded-md border border-[var(--brand-100)] bg-[var(--brand-50)] px-3.5 py-2.5">
                <span className="mt-0.5 shrink-0 text-[11px] font-bold uppercase tracking-[0.05em] whitespace-nowrap text-primary">You leave with</span>
                <span className="text-sm leading-relaxed text-[var(--brand-800)]">{stage.outcome}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
