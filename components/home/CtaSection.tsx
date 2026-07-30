"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="bg-[var(--neutral-900)] text-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="crib-container flex flex-col items-center gap-5 py-24 text-center lg:py-28"
      >
        <h2 className="max-w-[15em] text-[clamp(32px,4.2vw,54px)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance">
          Ready to see your business clearly?
        </h2>
        <p className="max-w-[32em] text-[17px] leading-relaxed text-balance text-white/68">
          Start with a 30-minute conversation. We&apos;ll meet you where your systems are today — and tell you honestly what we&apos;d fix first.
        </p>
        <Button asChild size="lg" className="mt-1.5">
          <Link href="/how-it-works">Book an intro call</Link>
        </Button>
      </motion.div>
    </section>
  );
}
