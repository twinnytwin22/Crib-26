"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe2, Layers, LineChart, Sparkles } from "lucide-react";

// Capability / value shorthand pills (variant 6 style)
const capabilityPill = [
  { icon: Globe2, label: "High-converting websites" },
  { icon: Layers, label: "SaaS MVP delivery" },
  { icon: LineChart, label: "SEO & social growth" },
];

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden pt-32">
      <motion.div
        className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800"
        style={{ transform: `translateY(${scrollY * 0.25}px)` }}
      />
      <div className="absolute inset-x-0 top-0 h-[580px] bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.4),transparent_55%)]" />
      <div className="absolute -top-16 right-10 h-64 w-64 rounded-full bg-red-500/30 blur-3xl" />
      <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 px-6 pb-24 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium text-white/80 backdrop-blur"
          >
            <Sparkles className="h-4 w-4" />
            Full-stack digital growth partner
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Unified Platform + Growth Strategy, Under One Roof
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl"
          >
            We deliver conversion-driven sites, SaaS MVPs, and full-stack
            integrations across web, software, social, and business tech to
            accelerate qualified pipeline.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-3 text-sm text-white/70"
          >
            {capabilityPill.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Button
              onClick={() => handleScrollTo("contact")}
              className="group rounded-full bg-red-500 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-red-500/30 transition hover:bg-red-600"
            >
              Book a Strategy Session
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleScrollTo("services")}
              className="rounded-full border-white/40 bg-transparent px-8 py-6 text-base font-semibold text-white hover:border-white hover:bg-white/10"
            >
              View Services
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur">
            <div className="mb-8 flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Outcomes We Engineer
              </span>
              <h3 className="text-2xl font-semibold leading-snug text-white">
                Product, site & acquisition working as one.
              </h3>
              <p className="text-sm text-white/60">
                Unified build + growth so every release and every post compounds
                into qualified demand.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
{
  title: "Launch Speed",
  metric: "90 days",
  description:
    "Rapid delivery of custom web or software platforms—built to scale, not shortcut.",
},
{
  title: "Organic Lift",
  metric: "+140%",
  description:
    "Search gains driven by strong technical foundations and ongoing content momentum.",
},
{
  title: "Social Impact",
  metric: "4×",
  description:
    "Multi-channel content and social systems that multiply your qualified pipeline.",
},


              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
                    {card.title}
                  </div>
                  <div className="mt-3 text-2xl font-bold text-white">
                    {card.metric}
                  </div>
                  {/* <p className="mt-2 text-xs leading-relaxed text-white/60">
                    {card.description}
                  </p> */}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/30 text-white/70 md:flex"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-xs uppercase tracking-[0.3em]">Scroll</div>
      </motion.div>
    </section>
  );
}
