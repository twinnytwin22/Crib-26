"use client";

import { motion } from "framer-motion";

const principles = [
  { title: "Strategy before tools", body: "We never start with a predetermined platform, rebuild, or product to sell. The diagnosis decides what gets built." },
  { title: "One fix at a time", body: "Improvements ship in bounded steps you can evaluate — not a single disruptive everything-project." },
  { title: "You own everything", body: "Documentation, decisions, access, and architecture stay usable by your team long after any engagement ends." },
  { title: "AI-ready, not AI-first", body: "AI needs a clear purpose, usable data, an owner, safeguards, and a way to evaluate it. Organizational data never goes into public consumer AI tools." },
];

export default function Principles() {
  return (
    <section className="bg-[var(--neutral-1000)] text-white">
      <div className="crib-container py-[96px] lg:py-32">
        <div className="crib-eyebrow mb-5 text-white/55">How we operate</div>
        <h2 className="crib-display mb-12 max-w-[11em] text-[clamp(46px,6vw,84px)]">
          The rules we hold ourselves to.
        </h2>
        <div className="grid border-y border-white/25 sm:grid-cols-2">
          {principles.map((p, index) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="min-h-[220px] border-b border-white/25 p-7 sm:border-r sm:odd:border-r lg:p-9"
            >
              <div className="mb-9 font-mono text-xs font-semibold text-[var(--brand-300)]">0{index + 1}</div>
              <div className="mb-3 text-xl font-extrabold tracking-[-0.025em]">{p.title}</div>
              <p className="text-sm leading-relaxed text-white/62">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
