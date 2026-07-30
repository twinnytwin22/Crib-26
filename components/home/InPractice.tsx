"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const rows = [
  {
    title: "Repeat customers, memberships & renewals",
    body: "See which first-time buyers, visitors, or sign-ups come back — and build the journeys that bring more of them back. One view of each relationship, across every tool that touches it.",
    chips: ["Customer journeys", "CRM & records", "Email & lifecycle", "Renewal signals"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    alt: "A team reviewing customer relationship data together",
    reverse: false,
  },
  {
    title: "Reporting leadership can trust",
    body: "No more assembling numbers by hand or defending definitions in meetings. Shared metrics, clean tracking, and dashboards that answer the questions leadership actually asks.",
    chips: ["Tracking plans", "KPI definitions", "Dashboards", "Attribution"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    alt: "A dashboard of reporting metrics in use during a meeting",
    reverse: true,
  },
  {
    title: "A website that pulls its weight",
    body: "Fast, modern, findable — and wired into the rest of your system, so every visit, booking, and sale feeds the picture instead of disappearing into another silo.",
    chips: ["Design & build", "Search visibility", "Conversion", "Clean data capture"],
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
    alt: "A modern website design shown on a laptop screen",
    reverse: false,
  },
];

export default function InPractice() {
  return (
    <section className="bg-background">
      <div className="crib-container py-24 lg:py-28">
        <div className="crib-eyebrow mb-4">In practice</div>
        <h2 className="mb-16 max-w-[18em] text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.1] tracking-[-0.025em] text-balance text-foreground">
          How that shows up in your business.
        </h2>
        <div className="flex flex-col gap-[72px]">
          {rows.map((row, index) => (
            <div
              key={row.title}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`flex flex-col gap-3.5 ${row.reverse ? "lg:order-2" : ""}`}
              >
                <h3 className="text-[26px] font-semibold tracking-[-0.02em] text-foreground">{row.title}</h3>
                <p className="text-base leading-relaxed text-balance text-[var(--text-2)]">{row.body}</p>
                <div className="flex flex-wrap gap-1.5">
                  {row.chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-border bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--text-2)]"
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
                className={`relative h-[280px] overflow-hidden rounded-[10px] sm:h-[340px] ${row.reverse ? "lg:order-1" : ""}`}
              >
                <Image
                  src={row.image}
                  alt={row.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized
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
