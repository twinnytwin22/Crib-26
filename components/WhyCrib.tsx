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
    <section id="why" className="relative overflow-hidden bg-[var(--neutral-900)] py-24 text-white">
      <div className="absolute inset-0 opacity-35">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.11) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 crib-container">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="crib-eyebrow mb-4 text-white/55">Why teams choose Crib</div>
            <h2 className="mb-6 text-3xl font-semibold leading-tight md:text-5xl">
              Engineered for the pace of modern digital companies.
            </h2>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/68 md:text-lg">
              Most partners deliver either code or campaigns. We deliver connected digital ecosystems: software experiences that convert, search strategies that scale, and social storytelling that keeps your brand visible.
            </p>

            <div className="grid gap-3">
              {["Dedicated pod of engineers, designers, and strategists", "Search, site, and social plans built on one insights stack", "Automation across CRMs, analytics, and marketing ops", "On-demand workshops and enablement for your internal team"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="flex items-center gap-3 text-sm text-white/78"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                    <Check className="h-4 w-4 text-white" />
                  </span>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className="rounded-lg border border-white/10 bg-white/5 p-5 text-white backdrop-blur"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/10 text-white">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-semibold">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-white/62">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
