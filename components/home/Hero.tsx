"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from 'next/image'
const reveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <header className="overflow-hidden bg-[var(--neutral-1000)] pt-16 text-white">
      <div className="crib-container grid min-h-[calc(100svh-64px)] border-x border-white/15 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between border-b border-white/15 px-5 py-10 sm:px-9 sm:py-14 lg:border-r lg:border-b-0 lg:px-12 lg:py-16">
          <motion.div
            variants={reveal}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
            className="crib-mono flex items-center justify-between gap-4 text-white/55"
          >
            <span>Digital systems consultancy</span>
          </motion.div>

          <div className="my-14 flex flex-col gap-8 lg:my-10">
            <motion.h1
              variants={reveal}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.65, delay: 0.08 }}
              className="crib-display  max-w-[8em] text-[clamp(64px,9.4vw,148px)] text-white"
            >
              Systems<span className="text-primary">,</span><br />
              made<br />
              clear.
            </motion.h1>

            <motion.p
              variants={reveal}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.55, delay: 0.18 }}
              className="max-w-[37em] border-l-2 border-primary pl-5 text-base leading-relaxed text-white/72 sm:text-lg"
            >
              CRIB connects the customer journeys, data, and digital systems behind growth—then fixes the constraint that matters most.
            </motion.p>
          </div>

          <motion.div
            variants={reveal}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.28 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg">
              <Link href="/how-it-works">Find the right starting point →</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
              <Link href="/services">See the system</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          variants={reveal}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, delay: 0.12 }}
          className="relative min-h-[440px] overflow-hidden lg:min-h-full"
        >
          <Image
            fill
            priority
            alt="Red flowers emerging from a dark field"
            className="object-cover object-center saturate-[1.08] contrast-[1.04]"
            src="/flowr-bg.jpg"
            sizes="(min-width: 1024px) 48vw, 100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/10" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/25 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.1em] text-white/70 sm:px-7">
            <span>Signal / growth</span>
            <span>01</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 border-t border-white/25 bg-black/35 font-mono text-[10px] uppercase tracking-[0.08em] text-white/75">
            <span className="border-r border-white/25 px-5 py-4 sm:px-7">Map / connect</span>
            <span className="px-5 py-4 text-right sm:px-7">Simple, together.</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
