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
    <section className="border-t border-border bg-[var(--surface-2)]">
      <div className="crib-container py-24">
        <div className="crib-eyebrow mb-4">Why CRIB</div>
        <h2 className="mb-12 max-w-[18em] text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.1] tracking-[-0.025em] text-balance text-foreground">
          Why organizations choose to work with us.
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, index) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="border-t-2 border-foreground pt-5"
            >
              <h3 className="mb-2 text-lg font-semibold tracking-[-0.01em] text-foreground">{r.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{r.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
