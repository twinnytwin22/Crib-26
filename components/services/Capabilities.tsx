"use client";

import { motion } from "framer-motion";

const capabilities = [
  { title: "Websites & digital experiences", body: "Design and build of fast, modern sites and pages that convert and capture clean data." },
  { title: "Customer data & CRM", body: "One reliable view of each customer relationship across every tool that touches it." },
  { title: "Measurement & reporting", body: "Tracking plans, shared definitions, and dashboards your whole team can trust." },
  { title: "Integrations & automation", body: "Connecting the tools you already own so information moves without manual work." },
  { title: "Search & content visibility", body: "Technical SEO and content structure that compound month over month." },
  { title: "Practical AI", body: "Applied where the evidence supports it — reporting, insight, and everyday workflows." },
];

export default function Capabilities() {
  return (
    <section className="border-y border-border bg-background">
      <div className="crib-container py-20">
        <div className="crib-eyebrow mb-4">Inside every step</div>
        <h2 className="mb-10 max-w-[20em] text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.12] tracking-[-0.02em] text-balance text-foreground">
          The capabilities we bring to the work.
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              className="border-t-2 border-[var(--brand-100)] pt-4"
            >
              <div className="mb-1.5 text-[15px] font-semibold text-foreground">{cap.title}</div>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{cap.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
