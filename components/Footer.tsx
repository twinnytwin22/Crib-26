"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import HomeFooter from "@/components/home/HomeFooter";
import SiteFooterCompact from "@/components/SiteFooterCompact";
import FitCheckLink from "@/components/FitCheckLink";

export default function Footer() {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";

  if (normalizedPathname === "/" || normalizedPathname === "/blog") {
    return <HomeFooter />;
  }

  if (
    normalizedPathname === "/services" ||
    normalizedPathname === "/how-it-works" ||
    normalizedPathname === "/contact"
  ) {
    return <SiteFooterCompact />;
  }

  return (
    <section id="contact" className="border-t border-white/20 bg-(--neutral-1000) py-14 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="crib-container font-mono text-[10px] uppercase tracking-[0.07em] text-white/55"
        >
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <span>© {new Date().getFullYear()} Crib Digital. All rights reserved.</span>
            <div className="flex flex-wrap items-center gap-6">
              <FitCheckLink surface="footer" className="border border-white/40 px-3 py-2 text-white transition hover:border-white hover:bg-white hover:text-(--neutral-1000)" />
              <a href="/privacy-policy" className="transition hover:text-white">
                Privacy Policy
              </a>
              <a href="/terms" className="transition hover:text-white">
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
    </section>
  );
}
