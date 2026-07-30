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
    <section className="border-y border-foreground bg-[var(--neutral-0)]">
      <div className="crib-container py-24 lg:py-32">
        <div className="crib-eyebrow mb-4">The difference</div>
        <h2 className="mb-14 max-w-[14em] text-[clamp(34px,4.6vw,64px)] font-normal leading-[0.98] tracking-[-0.045em] text-foreground">
          What changes when your systems are designed to be understood.
        </h2>
        <div className="grid items-stretch border border-foreground sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card p-7 sm:border-r sm:border-foreground lg:p-10"
          >
            <div className="mb-7 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--neutral-500)]">Before / fragmented</div>
            <div className="flex flex-col gap-3.5">
              {before.map((item) => (
                <div key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-px w-4 shrink-0 bg-[var(--neutral-500)]" />
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
            className="border-t border-foreground bg-primary p-7 text-white sm:border-t-0 lg:p-10"
          >
            <div className="mb-7 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-white/72">After / connected</div>
            <div className="flex flex-col gap-3.5">
              {after.map((item) => (
                <div key={item} className="flex items-start gap-3 text-[15px] font-semibold leading-relaxed text-white">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-white/55 text-white">
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
