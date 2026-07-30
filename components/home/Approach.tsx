"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const path = [
  {
    num: "01",
    label: "Understand",
    title: "See the whole system clearly",
    body: "A fixed-scope diagnostic defines one priority growth question, maps the journey and systems behind it, and produces a sequenced 90-day plan.",
  },
  {
    num: "02",
    label: "Fix",
    title: "Remove what's blocking growth",
    body: "One bounded sprint starts with a baseline and ends with a working improvement, validation evidence, documentation, and a named owner.",
  },
  {
    num: "03",
    label: "Grow",
    title: "Make it compound over time",
    body: "Monthly system-health reviews and an approved roadmap keep priorities moving — with practical AI introduced only when the foundation supports it.",
  },
];

export default function Approach() {
  return (
    <section className="bg-(--neutral-1000) text-white">
      <div className="crib-container py-24 lg:py-32">
        <div className="crib-eyebrow mb-5 text-white/60">Our approach</div>
        <div className="mb-16 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <h2 className="crib-display max-w-[12em] text-[clamp(46px,6.8vw,96px)]">
            Most agencies think in projects. We think in systems.
          </h2>
          <Link
            href="/services"
            className="border-b border-primary pb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-white whitespace-nowrap transition-colors hover:text-(--brand-300)"
          >
            Explore the services →
          </Link>
        </div>
        <div className="grid border-y border-white/25 lg:grid-cols-3">
          {path.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex min-h-[280px] flex-col gap-4 border-b border-white/20 py-8 lg:border-r lg:border-b-0 lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <div className="flex items-baseline gap-3.5">
                <span className="font-mono text-sm font-semibold text-(--brand-300)">{step.num}</span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">{step.label}</span>
              </div>
              <h3 className="text-3xl font-normal leading-[1.02] tracking-[-0.035em]">{step.title}</h3>
              <p className="text-[15px] leading-relaxed text-balance text-white/65">{step.body}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.08em] text-white/45">
          One partner from first diagnosis to a system that compounds — you&apos;re never handed off.
        </div>
      </div>
    </section>
  );
}
