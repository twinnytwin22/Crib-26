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
    <section className="relative min-h-[92svh] overflow-hidden pt-28 text-white sm:pt-32">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/AZ SHOTS.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[var(--neutral-1000)]/75" />
      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/10 to-black/55" />

      <div className="relative z-10 crib-container flex min-h-[calc(92svh-7rem)] flex-col justify-between gap-14 pb-10">
        <div className="max-w-4xl space-y-8 pt-6">
          <motion.div
            variants={reveal}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase text-white/80 backdrop-blur"
          >
            <Sparkles className="h-4 w-4" />
            Full-stack digital growth partner
          </motion.div>

          <motion.h1
            variants={reveal}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl text-5xl font-semibold leading-[1.04] text-white sm:text-6xl lg:text-7xl"
          >
            Build revenue engines, not just pretty websites.
          </motion.h1>

          <motion.p
            variants={reveal}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl text-base leading-relaxed text-white/76 sm:text-lg"
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
            className="flex max-w-3xl flex-wrap gap-2"
          >
            {capabilityPill.map((item) => (
              <span
                key={item.label}
                className="inline-flex min-h-9 items-center gap-2 rounded-md border border-white/18 bg-white/10 px-3 text-xs font-medium text-white/80 backdrop-blur sm:text-sm"
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
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button
              onClick={() => handleScrollTo("contact")}
              size="lg"
              className="group"
            >
              Book a Strategy Session
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleScrollTo("services")}
              size="lg"
              className="border-white/35 bg-white/10 text-white hover:bg-white/15 hover:text-white"
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
          className="grid gap-2 border-t border-white/12 pt-5 sm:grid-cols-3"
        >
          {outcomeCards.map((card) => (
            <div
              key={card.title}
              className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur"
            >
              <div className="text-xs font-semibold uppercase text-white/55">
                {card.title}
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {card.metric}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/66">
                {card.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
