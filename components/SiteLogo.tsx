"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SiteLogo() {
  return (
    <motion.div
      className="flex items-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href="/" className="flex items-center gap-3">
        <div className="relative h-10 w-32 md:w-40">
          <Image
            src="/crib-26-red-logo.png"
            alt="Crib logo"
            fill
            priority
            sizes="(min-width: 768px) 160px, 128px"
            className="object-contain"
          />
        </div>
        <span className="hidden font-semibold tracking-wider text-slate-900 md:inline">
          Crib Digital
        </span>
      </Link>
    </motion.div>
  );
}
