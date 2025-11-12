"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Check, GaugeCircle, Layers, ServerCog } from "lucide-react";

const benefits = [
  {
    icon: BrainCircuit,
    title: "Unified Product & Marketing",
    description: "Product strategists, engineers, and growth leads building in one pod so launches are cohesive from code to campaign.",
  },
  {
    icon: Layers,
    title: "Modular Delivery",
    description: "Sprint-based roadmaps keep software, web, SEO, and social initiatives shipping every two weeks without bottlenecks.",
  },
  {
    icon: ServerCog,
    title: "Data-Backed Decisions",
    description: "Live dashboards, attribution models, and experimentation frameworks translate insights into next-step prioritization.",
  },
  {
    icon: GaugeCircle,
    title: "Momentum After Launch",
    description: "Retainers geared for iteration—support, optimization, and enablement so your team is never left on an island.",
  },
];

export default function WhyCrib() {
  return (
    <section id="why" className="relative overflow-hidden bg-slate-950 py-24 px-6">
      <div className="absolute inset-0 opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-red-200">
              Why teams choose Crib
            </div>
            <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
              Engineered for the pace of modern digital companies.
            </h2>
            <p className="mb-8 text-xl text-white/70">
              Most partners deliver either code or campaigns. We deliver connected digital ecosystems—software experiences that convert, search strategies that scale, and social storytelling that keeps your brand top of feed.
            </p>

            <div className="space-y-4">
              {["Dedicated pod of engineers, designers, and strategists", "Search, site, and social plans built on one insights stack", "Automation across CRMs, analytics, and marketing ops", "On-demand workshops and enablement for your internal team"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-rose-500">
                    <Check className="h-4 w-4 text-white" />
                  </span>
                  <span className="text-base text-white/80">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-lg shadow-red-500/10 backdrop-blur"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-red-500 to-rose-500">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{benefit.title}</h3>
                <p className="text-sm text-white/70">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
