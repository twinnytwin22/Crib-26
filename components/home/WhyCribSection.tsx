"use client";

import { motion } from "framer-motion";

const reasons = [
  {
    title: "Systems, not projects",
    body: "Projects end. Systems compound. Every engagement leaves you with infrastructure that keeps working after we step back.",
  },
  {
    title: "Diagnosis before prescription",
    body: "We never arrive with a predetermined platform or rebuild to sell. The assessment decides what gets built — and in what order.",
  },
  {
    title: "You own everything",
    body: "Documentation, decisions, access, and architecture stay usable by your team. No black boxes, no hostage-taking.",
  },
  {
    title: "One team, strategy through build",
    body: "The people who map your system are the people who fix it. Nothing gets lost in a handoff.",
  },
];

export default function WhyCribSection() {
  return (
    <section className="border-t border-foreground bg-(--surface-2)">
      <div className="crib-container py-24 lg:py-32">
        <div className="crib-eyebrow mb-4">Why CRIB</div>
        <h2 className="mb-14 max-w-[13em] text-[clamp(38px,5vw,68px)] font-normal leading-[0.98] tracking-[-0.045em] text-foreground">
          Why organizations choose to work with us.
        </h2>
        <div className="grid border-y border-foreground sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, index) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="min-h-[260px] border-b border-foreground p-6 sm:border-r lg:border-b-0 lg:p-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <div className="mb-10 font-mono text-xs font-semibold text-primary">0{index + 1}</div>
              <h3 className="mb-3 text-xl font-normal leading-tight tracking-[-0.03em] text-foreground">{r.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{r.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
