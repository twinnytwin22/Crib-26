"use client";

import { motion } from "framer-motion";

const principles = [
  { title: "Strategy before tools", body: "We never start with a predetermined platform, rebuild, or product to sell. The diagnosis decides what gets built." },
  { title: "One fix at a time", body: "Improvements ship in bounded steps you can evaluate — not a single disruptive everything-project." },
  { title: "You own everything", body: "Documentation, decisions, access, and architecture stay usable by your team long after any engagement ends." },
  { title: "New tech has to earn its place", body: "AI and automation are introduced only where the data, the workflow, and the measurable outcome support them." },
];

export default function Principles() {
  return (
    <section className="bg-[var(--neutral-900)] text-white">
      <div className="crib-container py-[88px]">
        <div className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-white/55">How we operate</div>
        <h2 className="mb-10 max-w-[18em] text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.12] tracking-[-0.02em] text-balance">
          The rules we hold ourselves to.
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map((p, index) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="rounded-lg border border-white/12 bg-white/5 p-6"
            >
              <div className="mb-2 text-base font-semibold">{p.title}</div>
              <p className="text-sm leading-relaxed text-white/62">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
