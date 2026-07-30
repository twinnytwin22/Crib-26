"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const offers = [
  {
    num: "01",
    kicker: "The starting point",
    title: "Understand — the Growth & Data Diagnostic",
    body: "A fixed-scope review built around one priority growth question. We map the customer journey, tools, data, and reporting behind it, then identify the constraint that matters most.",
    timing: "Typically 2–3 weeks",
    deliverables: [
      { name: "Executive brief", desc: "where you stand, what it's costing you, and the next decision to make" },
      { name: "System & journey map", desc: "every tool, owner, and handoff — and where customers fall through" },
      { name: "Readiness snapshot", desc: "honest scores across data, measurement, digital experience, and AI readiness" },
      { name: "90-day plan", desc: "what to fix now, next, and later — with a clear first move" },
    ],
  },
  {
    num: "02",
    kicker: "Focused implementation",
    title: "Fix — one priority at a time",
    body: "We take the top item from your plan and deliver it as a tightly scoped sprint: reconnect systems, repair reporting, improve a high-friction journey, or clean up the records behind it.",
    timing: "Weeks, not months",
    deliverables: [
      { name: "A working change", desc: "shipped, tested against your real workflows, and in use" },
      { name: "Baseline & validation evidence", desc: "a defined starting point and proof that the change works" },
      { name: "Documentation", desc: "how it works and how to run it — written for your team" },
      { name: "A trained owner", desc: "someone on your side who can operate it without us" },
    ],
  },
  {
    num: "03",
    kicker: "Ongoing partnership",
    title: "Grow — a team that keeps it working",
    body: "Systems drift: tools change, staff turn over, and reports quietly break. We manage system health and an approved roadmap, introducing new capabilities only when the foundation supports them.",
    timing: "Monthly, with a quarterly strategy review",
    deliverables: [
      { name: "Monthly health brief", desc: "data quality, integrations, and reporting — checked and reported" },
      { name: "A living roadmap", desc: "priorities re-ranked as your business changes" },
      { name: "Quarterly strategy review", desc: "what's working, what's next, and why" },
      { name: "Defined operating support", desc: "prioritized issues, vendor guidance, and approved improvements managed against the roadmap" },
    ],
  },
];

export default function ServiceOffers() {
  return (
    <section className="bg-(--surface-2)">
      <div className="crib-container flex flex-col border-t border-foreground py-[72px] lg:py-28">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="grid gap-10 border-x border-b border-foreground bg-card p-7 md:grid-cols-[0.9fr_1.1fr] md:p-10 lg:p-12"
          >
            <div className="flex flex-col gap-3.5">
              <div className="flex items-baseline gap-3.5">
                <span className="font-mono text-sm font-semibold text-primary">{offer.num}</span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{offer.kicker}</span>
              </div>
              <h2 className="max-w-[16em] text-[clamp(30px,3.5vw,48px)] font-normal leading-[1.02] tracking-[-0.04em] text-foreground">{offer.title}</h2>
              <p className="text-[15px] leading-relaxed text-balance text-(--text-2)">{offer.body}</p>
              <div className="mt-auto flex items-center gap-3 border-t border-border pt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                <span className="h-2 w-2 bg-primary" />
                {offer.timing}
              </div>
            </div>
            <div className="flex flex-col gap-4 border-t border-foreground pt-8 md:border-t-0 md:border-l md:pl-12 md:pt-0">
              <div className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">What you get</div>
              {offer.deliverables.map((item) => (
                <div key={item.name} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-primary text-primary">
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
