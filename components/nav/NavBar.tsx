"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import SiteLogo from "../SiteLogo";

const navLinks = [
  { label: "Solutions", href: "#services" },
  { label: "Approach", href: "#why" },
  { label: "Results", href: "#results" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle hash navigation after page load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure page is loaded
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-x-0 top-0 z-50 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 shadow-sm  backdrop-blur md:mt-6">
        <SiteLogo />

        <nav className="hidden items-center gap-10 text-sm font-medium text-slate-100 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="transition-colors hover:text-slate-900"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/#contact">
            <Button className="rounded-full bg-red-600 px-6 text-white shadow-lg shadow-red-500/20 hover:bg-red-700">
              Book a Strategy Call
            </Button>
          </Link>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition md:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-auto mt-2 w-[90%] max-w-2xl overflow-hidden rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur md:hidden"
          >
            <div className="flex flex-col gap-4 text-base font-medium text-slate-700">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="rounded-xl px-4 py-3 text-left transition-colors hover:bg-slate-100/80"
                >
                  {link.label}
                </button>
              ))}
              <Link href="/#contact" onClick={() => setIsOpen(false)} className="mt-2">
                <Button className="w-full rounded-full bg-red-600 text-white shadow-lg shadow-red-500/20 hover:bg-red-700">
                  Book a Strategy Call
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
