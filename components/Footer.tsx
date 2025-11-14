"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  // Hide footer on homepage
  if (pathname === "/") {
    return null;
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-slate-950 py-24 px-6 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className=" border-t border-white/10 pt-10 text-sm text-white/50 max-w-7xl mx-auto"
        >
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <span>© {new Date().getFullYear()} Crib Digital. All rights reserved.</span>
            <div className="flex gap-8">
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
