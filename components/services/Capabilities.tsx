"use client";

import { motion } from "framer-motion";

const capabilities = [
  { title: "Websites & digital experiences", body: "Design and build of fast, modern sites and pages that convert and capture clean data." },
  { title: "Customer data & CRM", body: "A reliable customer view—and a clear decision to improve, integrate, buy, build, or defer new technology." },
  { title: "Measurement & reporting", body: "Tracking plans, shared definitions, and dashboards your whole team can trust." },
  { title: "Integrations & automation", body: "Connecting the tools you already own so information moves without manual work." },
  { title: "Acquisition & content performance", body: "Search foundations, content structure, conversion journeys, measurement, and clean data capture." },
  { title: "AI-ready systems", body: "Data, workflows, ownership, and safeguards prepared for controlled AI use when it creates real value." },
];

export default function Capabilities() {
  return (
    <section className="border-y border-foreground bg-background">
      <div className="crib-container py-24 lg:py-28">
        <div className="crib-eyebrow mb-4">Inside every step</div>
        <h2 className="mb-12 max-w-[14em] text-[clamp(36px,4.6vw,62px)] font-normal leading-none tracking-[-0.045em] text-foreground">
          The capabilities we bring to the work.
        </h2>
        <div className="grid border-y border-foreground sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              className="min-h-[200px] border-b border-foreground p-6 sm:border-r lg:p-7 lg:nth-[3n]:border-r-0"
            >
              <div className="mb-7 font-mono text-[10px] font-semibold text-primary">0{index + 1}</div>
              <div className="mb-2 text-lg font-extrabold leading-tight tracking-tight text-foreground">{cap.title}</div>
              <p className="text-sm leading-relaxed text-muted-foreground">{cap.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
