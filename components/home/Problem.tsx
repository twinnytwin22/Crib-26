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
      <div className="crib-container grid gap-14 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-[72px] lg:py-28">
        <div>
          <div className="sticky top-28 flex flex-col gap-4">
            <div className="crib-eyebrow">The problem</div>
            <h2 className="max-w-[13em] text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.08] tracking-[-0.025em] text-balance text-foreground">
              Your team is working hard. Your systems aren&apos;t working together.
            </h2>
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
              className="border-t border-border py-8"
            >
              <h3 className="mb-2.5 text-xl font-semibold tracking-[-0.015em] text-foreground">{prob.title}</h3>
              <p className="text-base leading-relaxed text-balance text-[var(--text-2)]">{prob.body}</p>
            </motion.div>
          ))}
          <div className="border-t border-border pt-7 text-base font-semibold text-primary">
            None of this means your team is behind. It means the system underneath them was never designed.
          </div>
        </div>
      </div>
    </section>
  );
}
