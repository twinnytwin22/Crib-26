"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const path = [
  {
    num: "01",
    label: "Understand",
    title: "See the whole system clearly",
    body: "A short, structured diagnostic maps your customer journey, your tools, your data, and your reporting — and finds the constraint that matters most.",
  },
  {
    num: "02",
    label: "Fix",
    title: "Remove what's blocking growth",
    body: "Focused sprints deliver one bounded improvement at a time: a reconnected tool, a trustworthy report, a page that stops losing customers. Proven, documented, owned.",
  },
  {
    num: "03",
    label: "Grow",
    title: "Make it compound over time",
    body: "We stay on to keep data clean, reporting honest, and the roadmap moving — introducing new capabilities, including practical AI, as the foundation earns them.",
  },
];

export default function Approach() {
  return (
    <section className="bg-[var(--neutral-900)] text-white">
      <div className="crib-container py-24 lg:py-28">
        <div className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--brand-300)]">Our approach</div>
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-[15em] text-[clamp(30px,3.8vw,48px)] font-semibold leading-[1.06] tracking-[-0.025em] text-balance">
            Most agencies think in projects. We think in systems.
          </h2>
          <Link
            href="/services"
            className="border-b border-white/40 pb-0.5 text-sm font-semibold text-white whitespace-nowrap transition-colors hover:text-[var(--brand-300)]"
          >
            Explore the services →
          </Link>
        </div>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {path.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col gap-3 border-t border-white/18 pt-6"
            >
              <div className="flex items-baseline gap-3.5">
                <span className="text-[15px] font-bold text-[var(--brand-300)]">{step.num}</span>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/50">{step.label}</span>
              </div>
              <h3 className="text-2xl font-semibold leading-tight tracking-[-0.015em]">{step.title}</h3>
              <p className="text-[15px] leading-relaxed text-balance text-white/65">{step.body}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 border-t border-white/12 pt-6 text-sm text-white/50">
          One partner from first diagnosis to a system that compounds — you&apos;re never handed off.
        </div>
      </div>
    </section>
  );
}
