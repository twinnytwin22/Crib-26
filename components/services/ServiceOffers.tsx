"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const offers = [
  {
    num: "01",
    kicker: "The starting point",
    title: "Understand — the Growth & Data Diagnostic",
    body: "A short, structured review of how your business actually runs: the customer journey, the tools behind it, the data they collect, and the reports built on top. No sales theater — a real assessment you can act on with or without us.",
    timing: "Typically 2–3 weeks",
    deliverables: [
      { name: "Executive brief", desc: "where you stand, what it's costing you, and the next decision to make" },
      { name: "System & journey map", desc: "every tool, owner, and handoff — and where customers fall through" },
      { name: "Readiness snapshot", desc: "honest scores across data, measurement, and digital experience" },
      { name: "90-day plan", desc: "what to fix now, next, and later — with a clear first move" },
    ],
  },
  {
    num: "02",
    kicker: "Focused implementation",
    title: "Fix — one priority at a time",
    body: "We take the top item from your plan and deliver it as a tightly scoped sprint: reconnect two systems, repair a report leadership can trust, rebuild a page or form that loses customers, clean up your records. One bounded improvement, done properly.",
    timing: "Weeks, not months",
    deliverables: [
      { name: "A working change", desc: "shipped, tested against your real workflows, and in use" },
      { name: "Before-and-after evidence", desc: "so you can see the difference, not take our word for it" },
      { name: "Documentation", desc: "how it works and how to run it — written for your team" },
      { name: "A trained owner", desc: "someone on your side who can operate it without us" },
    ],
  },
  {
    num: "03",
    kicker: "Ongoing partnership",
    title: "Grow — a team that keeps it working",
    body: "Systems drift: tools change, staff turn over, reports quietly break. We stay on as your growth and systems partner — monitoring health, keeping the roadmap moving, and introducing new capabilities (including practical AI) when your foundation is ready for them.",
    timing: "Monthly, with a quarterly strategy review",
    deliverables: [
      { name: "Monthly health brief", desc: "data quality, integrations, and reporting — checked and reported" },
      { name: "A living roadmap", desc: "priorities re-ranked as your business changes" },
      { name: "Quarterly strategy review", desc: "what's working, what's next, and why" },
      { name: "A team on call", desc: "vendor questions, new tools, quick fixes — handled" },
    ],
  },
];

export default function ServiceOffers() {
  return (
    <section className="bg-[var(--surface-2)]">
      <div className="crib-container flex flex-col gap-6 py-[72px]">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="crib-card grid gap-12 p-10 md:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="flex flex-col gap-3.5">
              <div className="flex items-baseline gap-3.5">
                <span className="text-sm font-bold tracking-[0.04em] text-primary">{offer.num}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground">{offer.kicker}</span>
              </div>
              <h2 className="text-[clamp(24px,3vw,34px)] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground">{offer.title}</h2>
              <p className="text-[15px] leading-relaxed text-balance text-[var(--text-2)]">{offer.body}</p>
              <div className="mt-auto flex items-center gap-2 pt-3 text-[13px] font-semibold text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {offer.timing}
              </div>
            </div>
            <div className="flex flex-col gap-3 border-l border-[var(--neutral-100)] pl-12">
              <div className="mb-1 text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">What you get</div>
              {offer.deliverables.map((item) => (
                <div key={item.name} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[var(--brand-100)] bg-[var(--brand-50)] text-primary">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">{item.name}</span>
                    <span className="text-muted-foreground"> — {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
