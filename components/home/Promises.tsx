"use client";

import { motion } from "framer-motion";

const promises = [
  { title: "One view of every customer", body: "Every tool that touches a relationship, connected into a single picture." },
  { title: "Reports you can trust", body: "Shared definitions and clean tracking — no more assembling numbers by hand." },
  { title: "A plan you can act on", body: "What to fix now, next, and later. Sequenced by value, not by vendor." },
];

export default function Promises() {
  return (
    <section className="border-b border-border bg-background">
      <div className="crib-container grid gap-10 py-11 sm:grid-cols-2 lg:grid-cols-3">
        {promises.map((p, index) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="border-l-2 border-primary pl-5"
          >
            <div className="text-lg font-semibold tracking-[-0.01em] text-foreground">{p.title}</div>
            <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
