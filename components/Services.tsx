"use client";

import { motion } from "framer-motion";
import { BarChart3, BrainCircuit, Code2, Rocket, ShieldCheck, Users } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Custom Software Platforms",
    description:
      "Design, engineer, and launch scalable SaaS products, internal tools, and customer portals with modern stacks.",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: ShieldCheck,
    title: "Conversion-Driven Websites",
    description:
      "Build lightning-fast marketing sites and digital experiences that convert across devices and funnel stages.",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: BarChart3,
    title: "SEO & Content Architecture",
    description:
      "Architect technical SEO, content strategy, and automation to dominate search intent and unlock compound traffic.",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: Users,
    title: "Social Media Acceleration",
    description:
      "Ship always-on, insight-led content engines that grow audience, demand, and community across every channel.",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: BrainCircuit,
    title: "Automation & Integrations",
    description:
      "Connect CRMs, data warehouses, and marketing tools with no-code & custom automation to keep teams in sync.",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: Rocket,
    title: "Growth Operations",
    description:
      "Experimentation programs, analytics, and reporting that translate metrics into confident product and marketing moves.",
    gradient: "from-red-500 to-rose-500",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-linear-to-b from-[#FAFAF9] to-white py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-red-600">Our solutions</div>
          <h2 className="mb-6 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            Build the systems your next stage of growth demands.
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            We merge product thinking, creative storytelling, and performance marketing into integrated service lines that move metrics across the entire customer journey.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-lg shadow-slate-200/50 transition-all duration-300"
            >
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br ${service.gradient} text-white shadow-lg shadow-red-500/40 transition-transform duration-300 group-hover:scale-110`}>
                <service.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900">{service.title}</h3>
              <p className="text-slate-600">{service.description}</p>
              <div className={`pointer-events-none absolute -inset-0.5 rounded-2xl bg-linear-to-br ${service.gradient} opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-20`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
