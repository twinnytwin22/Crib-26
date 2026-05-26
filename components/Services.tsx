"use client";

import { motion } from "framer-motion";
import { BarChart3, BrainCircuit, Code2, Rocket, ShieldCheck, Users } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Custom Software Platforms",
    description:
      "Design, engineer, and launch scalable SaaS products, internal tools, and customer portals with modern stacks.",
  },
  {
    icon: ShieldCheck,
    title: "Conversion-Driven Websites",
    description:
      "Build lightning-fast marketing sites and digital experiences that convert across devices and funnel stages.",
  },
  {
    icon: BarChart3,
    title: "SEO & Content Architecture",
    description:
      "Architect technical SEO, content strategy, and automation to dominate search intent and unlock compound traffic.",
  },
  {
    icon: Users,
    title: "Social Media Acceleration",
    description:
      "Ship always-on, insight-led content engines that grow audience, demand, and community across every channel.",
  },
  {
    icon: BrainCircuit,
    title: "Automation & Integrations",
    description:
      "Connect CRMs, data warehouses, and marketing tools with no-code & custom automation to keep teams in sync.",
  },
  {
    icon: Rocket,
    title: "Growth Operations",
    description:
      "Experimentation programs, analytics, and reporting that translate metrics into confident product and marketing moves.",
  },
];

export default function Services() {
  return (
    <section id="services" className="crib-section border-b border-border bg-background">
      <div className="crib-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="crib-eyebrow mb-4">Our solutions</div>
          <h2 className="text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            Build the systems your next stage of growth demands.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            We merge product thinking, creative storytelling, and performance marketing into integrated service lines that move metrics across the entire customer journey.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="crib-card group h-full p-6 transition-colors hover:border-[var(--neutral-300)]"
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-md border border-[var(--brand-100)] bg-[var(--brand-50)] text-primary">
                <service.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">{service.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
