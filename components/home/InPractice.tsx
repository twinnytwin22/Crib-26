"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const rows = [
  {
    title: "Retention is hard to see",
    body: "Customers engage across several tools, but repeat behavior and retention are unclear. Connect the journey and records that matter so you can see what brings people back.",
    chips: ["Customer journeys", "CRM & records", "Email & lifecycle", "Renewal signals"],
    image: "/retention.jpg",
    alt: "Warm handshake/office teamwork",
    reverse: false,
  },
  {
    title: "Reporting lacks trust",
    body: "Leadership reporting is manual or disputed and cannot reliably explain customer behavior or performance. Create shared definitions, clean tracking, and reports built for real decisions.",
    chips: ["Tracking plans", "KPI definitions", "Dashboards", "Attribution"],
    image: "/leadership-reporting.jpg",
    alt: "Colleagues reviewing graphs/charts together",
    reverse: true,
  },
  {
    title: "Systems create manual work",
    body: "Priority tools do not exchange information reliably, forcing staff to export, reconcile, and re-enter data. Repair the handoffs so information moves with less effort and fewer errors.",
    chips: ["Integrations", "Workflow design", "Automation", "Owner handoff"],
    image: "/manual-work.jpg",
    alt: "Man analyzing flowchart on whiteboard",
    reverse: false,
  },
];

export default function InPractice() {
  return (
    <section className="bg-background">
      <div className="crib-container py-24 lg:py-32">
        <div className="crib-eyebrow mb-4">In practice</div>
        <h2 className="mb-16 max-w-[13em] text-[clamp(38px,5vw,68px)] font-normal leading-[0.98] tracking-[-0.045em] text-foreground">
          Problems that signal it&apos;s time to connect the system.
        </h2>
        <div className="flex flex-col border-t border-foreground">
          {rows.map((row, index) => (
            <div
              key={row.title}
              className="grid items-stretch border-b border-foreground lg:grid-cols-2"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`flex flex-col justify-center gap-5 px-1 py-10 sm:px-8 lg:min-h-[440px] lg:px-12 ${row.reverse ? "lg:order-2 lg:border-l lg:border-foreground" : "lg:border-r lg:border-foreground"}`}
              >
                <div className="font-mono text-xs font-semibold text-primary">0{index + 1}</div>
                <h3 className="max-w-[14em] text-[clamp(28px,3vw,42px)] font-normal leading-[1.02] tracking-[-0.04em] text-foreground">{row.title}</h3>
                <p className="max-w-[38em] text-base leading-relaxed text-(--text-2)">{row.body}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {row.chips.map((c) => (
                    <span
                      key={c}
                      className="border border-border bg-(--surface-2) px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.07em] text-(--text-2)"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`relative min-h-80 overflow-hidden lg:min-h-[440px] ${row.reverse ? "lg:order-1" : ""}`}
              >
                <Image
                  src={row.image}
                  alt={row.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  loading={index === 0 ? undefined : "lazy"}
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
