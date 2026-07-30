"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // These pages render their own footer matching their design
  if (pathname === "/" || pathname === "/services" || pathname === "/how-it-works") {
    return null;
  }

  return (
    <section id="contact" className="border-t border-white/20 bg-[var(--neutral-1000)] py-14 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="crib-container font-mono text-[10px] uppercase tracking-[0.07em] text-white/55"
        >
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <span>© {new Date().getFullYear()} Crib Digital. All rights reserved.</span>
            <div className="flex flex-wrap gap-6">
              <a href="/privacy-policy" className="transition hover:text-white">
                Privacy Policy
              </a>
              <a href="/terms" className="transition hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="transition hover:text-white">
                Careers
              </a>
            </div>
          </div>
        </motion.div>
    </section>
  );
}
