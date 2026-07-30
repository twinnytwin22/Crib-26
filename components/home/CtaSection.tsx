"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="border-y border-foreground bg-primary text-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="crib-container grid gap-10 py-24 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:py-32"
      >
        <div>
          <div className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white/72">The first move / 30 minutes</div>
          <h2 className="crib-display max-w-[10em] text-[clamp(52px,7vw,104px)]">
            Find the right starting point.
          </h2>
        </div>
        <div className="flex flex-col items-start gap-6 border-t border-white/55 pt-6 text-black hover:text-white">
          <p className="max-w-[32em] text-[17px] leading-relaxed text-white/82">
            Start with a straightforward conversation. We&apos;ll determine fit, define the priority question, and explain what we would examine first.
          </p>
          <Button asChild size="lg" variant="inverse">
            <Link href="/how-it-works">Find the right starting point →</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
