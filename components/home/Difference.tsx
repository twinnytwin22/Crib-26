"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const before = [
  "Customer data scattered across disconnected tools",
  "Reports assembled by hand, disputed in meetings",
  "Staff time lost to exports and re-entry",
  "New tech decisions made on instinct",
];

const after = [
  "One connected view of every customer relationship",
  "Dashboards with definitions everyone shares",
  "Information moves between tools on its own",
  "A sequenced roadmap — evidence decides what's next",
];

export default function Difference() {
  return (
    <section className="border-y border-border bg-[var(--surface-2)]">
      <div className="crib-container py-24">
        <div className="crib-eyebrow mb-4">The difference</div>
        <h2 className="mb-12 max-w-[20em] text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.1] tracking-[-0.025em] text-balance text-foreground">
          What changes when your systems are designed to be understood.
        </h2>
        <div className="grid items-stretch gap-5 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-[var(--neutral-200)] bg-card p-8"
          >
            <div className="mb-5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--neutral-400)]">Before</div>
            <div className="flex flex-col gap-3.5">
              {before.map((item) => (
                <div key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--neutral-300)]" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl border border-[var(--brand-100)] border-t-[3px] border-t-primary bg-card p-8 shadow-[0_20px_42px_-24px_rgba(191,25,0,0.25)]"
          >
            <div className="mb-5 text-xs font-bold uppercase tracking-[0.1em] text-primary">After</div>
            <div className="flex flex-col gap-3.5">
              {after.map((item) => (
                <div key={item} className="flex items-start gap-3 text-[15px] font-medium leading-relaxed text-foreground">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[var(--brand-100)] bg-[var(--brand-50)] text-primary">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
