import Link from "next/link";
import Image from "next/image";
import FitCheckLink from "@/components/FitCheckLink";

export default function SiteFooterCompact() {
  return (
    <footer className="border-t border-white/20 bg-(--neutral-1000) text-white/60">
      <div className="crib-container flex flex-wrap items-center justify-between gap-8 py-10 font-mono text-[10px] uppercase tracking-[0.07em]">
        <div className="flex items-center gap-4">
          <Image src="/CRIB_LOGO_WHITE.svg" alt="CRIB" width={72} height={16} className="h-4 w-auto opacity-90" />
          <span>© {new Date().getFullYear()} CRIB Network.</span>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link href="/services" className="transition hover:text-white">Services</Link>
          <Link href="/how-it-works" className="transition hover:text-white">How it works</Link>
          <FitCheckLink surface="footer" className="transition hover:text-white" />
          <Link href="/blog" className="transition hover:text-white">Blog</Link>
        </div>
      </div>
    </footer>
  );
}
