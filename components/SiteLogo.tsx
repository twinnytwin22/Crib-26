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
      <Link href="/" className="flex items-center gap-3" aria-label="CRIB home">
        <div className="relative h-8 w-28 md:w-32">
          <Image
            src="/CRIB_LOGO_RED.svg"
            alt="Crib logo"
            fill
            priority
            sizes="(min-width: 768px) 128px, 112px"
            className="object-contain"
          />
        </div>
      </Link>
    </motion.div>
  );
}
