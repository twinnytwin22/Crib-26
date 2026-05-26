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
      className="fixed inset-x-0 top-0 z-50 border-b border-border bg-white/90 backdrop-blur"
    >
      <div className="crib-container flex h-14 items-center justify-between gap-6">
        <SiteLogo />

        <nav className="hidden items-center gap-1 text-sm font-medium text-[var(--text-2)] md:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="rounded-md px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/#contact">
            <Button size="sm">
              Book a Strategy Call
            </Button>
          </Link>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm transition md:hidden"
          aria-label="Toggle navigation menu"
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
            className="mx-auto mt-2 w-[calc(100%-24px)] max-w-2xl overflow-hidden rounded-lg border border-border bg-card p-3 shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-1 text-sm font-medium text-[var(--text-2)]">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="rounded-md px-3 py-3 text-left transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </button>
              ))}
              <Link href="/#contact" onClick={() => setIsOpen(false)} className="mt-2">
                <Button className="w-full">
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
