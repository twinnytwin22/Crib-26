"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const reveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <header className="relative flex min-h-[min(88vh,780px)] items-end overflow-hidden bg-[var(--neutral-900)] pt-14 text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/AZ SHOTS.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[rgba(11,13,17,0.82)] via-[rgba(11,13,17,0.45)] to-[rgba(11,13,17,0.25)]" />

      <div className="crib-container relative z-10 flex flex-col gap-6 py-16 sm:py-20 lg:py-24">
        <motion.h1
          variants={reveal}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-[13em] text-[clamp(42px,5.6vw,76px)] font-semibold leading-[1.02] tracking-[-0.03em] text-balance text-white"
        >
          Clarity in your systems. Confidence in your growth.
        </motion.h1>

        <motion.p
          variants={reveal}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-[33em] text-base leading-relaxed text-white/82 sm:text-lg"
        >
          CRIB connects your website, customer data, and everyday tools into one system you can see, trust, and grow with.
        </motion.p>

        <motion.div
          variants={reveal}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          <Button asChild size="lg">
            <Link href="/how-it-works">Start the conversation</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/35 bg-white/10 text-white backdrop-blur hover:bg-white/18 hover:text-white"
          >
            <Link href="/services">What we do</Link>
          </Button>
        </motion.div>
      </div>
    </header>
  );
}
