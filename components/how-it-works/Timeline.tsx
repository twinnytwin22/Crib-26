"use client";

import { motion } from "framer-motion";

const stages = [
  {
    num: "1",
    title: "Intro call",
    timing: "30 minutes · free",
    body: "A straightforward conversation about your goals, your tools, and what's getting in the way. We determine fit and explain what we would examine first — without pretending the diagnosis is already done.",
    outcome: "A clear read on fit and whether there is a focused problem worth diagnosing.",
  },
  {
    num: "2",
    title: "Fit & focus",
    timing: "One short follow-up",
    body: "We agree on the one growth question that matters most right now — repeat customers, trusted reporting, or a channel that isn't converting — and scope the diagnostic around it.",
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
    body: "One tightly scoped sprint delivers the top priority. We define the baseline, test the change with your real work, document it, and hand it to a named owner on your team.",
    outcome: "A working improvement with validation evidence, documentation, and clear ownership.",
  },
  {
    num: "6",
    title: "Ongoing partnership",
    timing: "Monthly",
    body: "Once trust is earned, we manage system health, prioritize issues, guide vendors, and move an approved roadmap forward. Practical AI enters only when the foundation supports it.",
    outcome: "A monthly health brief, managed roadmap, approved improvements, and quarterly strategy review.",
  },
];

export default function Timeline() {
  return (
    <section className="bg-[var(--surface-2)]">
      <div className="crib-container flex flex-col border-t border-foreground py-[72px] lg:py-28">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.45 }}
            className="grid grid-cols-[56px_1fr] gap-5 border-x border-b border-foreground bg-card sm:grid-cols-[84px_1fr]"
          >
            <div className="flex items-start justify-center border-r border-foreground pt-7 sm:pt-9">
              <div className="font-mono text-lg font-semibold text-primary">
                {stage.num}
              </div>
            </div>
            <div className="py-7 pr-5 sm:py-9 sm:pr-9">
              <div className="mb-2 flex flex-wrap items-baseline gap-3">
                <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold leading-tight tracking-[-0.035em] text-foreground">{stage.title}</h2>
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">{stage.timing}</span>
              </div>
              <p className="mb-3.5 max-w-[44em] text-[15px] leading-relaxed text-balance text-[var(--text-2)]">{stage.body}</p>
              <div className="inline-flex max-w-[44em] items-start gap-3 border-l-2 border-primary bg-[var(--brand-50)] px-4 py-3">
                <span className="mt-0.5 shrink-0 font-mono text-[9px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap text-primary">You leave with</span>
                <span className="text-sm leading-relaxed text-[var(--brand-800)]">{stage.outcome}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
