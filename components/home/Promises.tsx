"use client";

import { motion } from "framer-motion";

const promises = [
  { title: "A reliable view of each relationship", body: "The systems & tools that matter, connected into a clearer customer picture." },
  { title: "Reports you can trust", body: "Shared definitions and clean tracking — no more assembling numbers by hand." },
  { title: "A plan you can act on", body: "What to fix now, next, and later. Sequenced by value, not by vendor." },
];

export default function Promises() {
  return (
    <section className="border-y border-foreground bg-(--neutral-0)">
      <div className="crib-container grid lg:grid-cols-3">
        {promises.map((p, index) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="grid grid-cols-[42px_1fr] gap-4 border-b border-border py-8 lg:border-r lg:border-b-0 lg:px-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
          >
            <div className="font-mono text-xs font-semibold text-primary">0{index + 1}</div>
            <div>
              <div className="text-lg font-bold leading-tight tracking-tight text-foreground">{p.title}</div>
              <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
