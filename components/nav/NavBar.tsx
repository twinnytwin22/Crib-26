"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import SiteLogo from "../SiteLogo";

const navLinks = [
  { index: "01", label: "Services", href: "/services" },
  { index: "02", label: "How it works", href: "/how-it-works" },
  { index: "03", label: "Journal", href: "/blog" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleNavClick = () => {
    setIsOpen(false);
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
      className="fixed inset-x-0 top-0 z-50 border-b border-(--neutral-900) bg-(--neutral-0)"
    >
      <div className="crib-container flex h-16 items-center justify-between gap-6">
        <SiteLogo />

        <nav className="hidden items-center gap-7 font-mono text-xs font-medium uppercase tracking-[0.08em] text-(--text-2) md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 border-b border-transparent py-2 transition-colors hover:border-primary hover:text-foreground"
            >
              <span className="text-primary">{link.index}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex text-white">
          <Button asChild size="sm" className="text-white">
            <Link href="/how-it-works" className="text-white">
              Book a Strategy Session
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex h-10 w-10 items-center justify-center border border-foreground bg-card text-foreground transition hover:bg-foreground hover:text-background md:hidden"
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
            className="mx-auto w-[calc(100%-28px)] max-w-2xl overflow-hidden border-x border-b border-foreground bg-card p-3 md:hidden"
          >
            <div className="flex flex-col font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-(--text-2)">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="flex items-center gap-3 border-b border-border px-3 py-4 text-left transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <span className="text-primary">{link.index}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              <Button asChild className="mt-2 w-full">
                <Link href="/how-it-works" onClick={() => setIsOpen(false)}>
                  Book a Strategy Session
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
