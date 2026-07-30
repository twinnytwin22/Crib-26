"use client";

import { motion } from "framer-motion";

const problems = [
  {
    title: "Money is moving. You can't see why.",
    body: "Sales, sign-ups, renewals, and campaigns are happening — but the data lives in five tools, attribution is a guessing game, and the questions leadership asks are the ones you can't answer.",
  },
  {
    title: "The tools multiplied. The picture didn't.",
    body: "Every platform was added for a good reason. Now staff export, re-enter, and reconcile between them — and nobody owns how the whole thing fits together.",
  },
  {
    title: "Everyone says AI. Nobody says what first.",
    body: "The pressure to modernize is constant. But new technology stacked on fragmented data and broken reporting just produces faster confusion.",
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
                <h3 className="mb-3 text-2xl font-bold leading-tight tracking-[-0.03em] text-foreground">{prob.title}</h3>
                <p className="text-base leading-relaxed text-[var(--text-2)]">{prob.body}</p>
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
