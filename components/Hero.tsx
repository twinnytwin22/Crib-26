"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe2, Layers, LineChart, Sparkles } from "lucide-react";

// Capability / value shorthand pills (variant 6 style)
const capabilityPill = [
  { icon: Globe2, label: "High-converting websites" },
  { icon: Layers, label: "SaaS MVP delivery" },
  { icon: LineChart, label: "SEO and social growth" },
];

const outcomeCards = [
  {
    title: "Launch Speed",
    metric: "90 days",
    description: "Custom platform delivery built for traction and scale.",
  },
  {
    title: "Organic Lift",
    metric: "+140%",
    description: "Search momentum from technical SEO and compounding content.",
  },
  {
    title: "Social Impact",
    metric: "4x",
    description: "Cross-channel systems that increase qualified pipeline.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <motion.div
        className="absolute inset-0 bg-linear-to-b from-[#08111e] via-[#0b1a2d] to-[#0f2741]"
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(239,68,68,0.32),transparent_38%),radial-gradient(circle_at_85%_30%,rgba(56,189,248,0.24),transparent_40%),linear-gradient(120deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_35%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(110deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_24px)] opacity-30" />
      <div className="absolute -top-16 right-10 h-64 w-64 rounded-full bg-red-400/30 blur-3xl" />
      <div className="absolute bottom-4 left-10 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-20 sm:gap-16 sm:pb-24 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="space-y-10 text-white">
          <motion.div
            variants={reveal}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-white/85 backdrop-blur sm:px-5 sm:text-sm"
          >
            <Sparkles className="h-4 w-4" />
            Full-stack digital growth partner
          </motion.div>

          <motion.h1
            variants={reveal}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl text-4xl leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Build Revenue Engines, Not Just Pretty Websites
          </motion.h1>

          <motion.p
            variants={reveal}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl"
          >
            Crib combines product strategy, high-performing web experiences, and
            growth systems into one execution lane so every launch drives
            measurable demand.
          </motion.p>

          <motion.div
            variants={reveal}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.35 }}
            className="grid max-w-2xl gap-3 sm:grid-cols-3"
          >
            {capabilityPill.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-xs font-medium text-white/80 backdrop-blur sm:text-sm"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
            ))}
          </motion.div>

          <motion.div
            variants={reveal}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5"
          >
            <Button
              onClick={() => handleScrollTo("contact")}
              className="group rounded-full bg-red-500 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-red-500/35 transition hover:bg-red-600"
            >
              Book a Strategy Session
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleScrollTo("services")}
              className="rounded-full border-white/55 bg-transparent px-8 py-6 text-base font-semibold text-white hover:border-white hover:bg-white/10"
            >
              View Services
            </Button>
          </motion.div>
        </div>

        <motion.div
          variants={reveal}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative lg:pl-6"
        >
          <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-7 text-white shadow-2xl backdrop-blur sm:p-8">
            <div className="mb-7 flex flex-col gap-3 sm:mb-8 sm:gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Outcomes We Engineer
              </span>
              <h3 className="text-2xl leading-snug text-white sm:text-3xl">
                Product, marketing, and automation in one operating system.
              </h3>
              <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                We align build velocity and go-to-market execution so each week
                creates momentum, not isolated deliverables.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {outcomeCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-white/20 bg-slate-950/25 p-4"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/65">
                    {card.title}
                  </div>
                  <div className="mt-3 text-2xl font-bold text-red-200">
                    {card.metric}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/75">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/40 text-white/75 md:flex"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-xs uppercase tracking-[0.3em]">Scroll</div>
      </motion.div>
    </section>
  );
}
