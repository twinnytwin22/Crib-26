"use client";

import { motion } from "framer-motion";

const problems = [
  {
    title: "You can see the outcome. Not the path behind it.",
    body: "Revenue lands. Sign-ups climb. A campaign performs. But ask what actually drove any of it — which channel, which change, which month it started — and the honest answer is that no one can trace it back.",
  },
  {
    title: "The tools multiplied. But they don't connect.",
    body: "Every platform was added for a good reason. None of them were added with the others in mind. So staff export, re-enter, and reconcile by hand — and the seams between systems quietly become someone's second job.",
  },
  {
    title: "Everyone says AI. Nobody says what first.",
    body: "The mandate to modernize arrives without a sequence. But AI inherits whatever it's built on, and layered over fragmented data and reporting no one trusts, it doesn't resolve the confusion — it just produces it faster.",
  },
];

export default function Problem() {
  return (
    <section className="bg-background">
      <div className="crib-container grid gap-14 py-24 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:py-32">
        <div>
          <div className="sticky top-28 flex flex-col gap-4">
            <div className="crib-eyebrow">The problem</div>
            <h2 className="crib-display max-w-[10em] text-[clamp(44px,5.8vw,82px)] text-foreground">
              Hard work.<br />Disconnected systems.
            </h2>
            <p className="max-w-[30em] border-l-2 border-primary pl-4 text-sm leading-relaxed text-[var(--text-2)]">
              Built for organizations with multiple customer or audience types, disconnected platforms, and leadership pressure to improve growth, reporting, or modernization.
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          {problems.map((prob, index) => (
            <motion.div
              key={prob.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="grid gap-4 border-t border-foreground py-8 sm:grid-cols-[48px_1fr]"
            >
              <div className="font-mono text-xs font-semibold text-primary">0{index + 1}</div>
              <div>
                <h3 className="mb-3 text-2xl font-normal leading-tight tracking-[-0.03em] text-foreground">{prob.title}</h3>
                <p className="text-base leading-relaxed text-(--text-2)">{prob.body}</p>
              </div>
            </motion.div>
          ))}
          <div className="border-t-2 border-primary py-7 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-primary">
            None of this means your team is behind. It means the system underneath them was never designed.
          </div>
        </div>
      </div>
    </section>
  );
}
