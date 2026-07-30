import Link from "next/link";
import Image from "next/image";

export default function SiteFooterCompact() {
  return (
    <footer className="bg-[var(--neutral-1000)] text-white/55">
      <div className="crib-container flex flex-wrap items-center justify-between gap-6 py-10">
        <div className="flex items-center gap-4">
          <Image src="/CRIB_LOGO_WHITE.svg" alt="CRIB" width={72} height={16} className="h-4 w-auto opacity-90" />
          <span className="text-[13px]">© {new Date().getFullYear()} CRIB Network. All rights reserved.</span>
        </div>
        <div className="flex gap-6 text-[13px]">
          <Link href="/services" className="transition hover:text-white">Services</Link>
          <Link href="/how-it-works" className="transition hover:text-white">How it works</Link>
          <Link href="/blog" className="transition hover:text-white">Blog</Link>
        </div>
      </div>
    </footer>
  );
}
