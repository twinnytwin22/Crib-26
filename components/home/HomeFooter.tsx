import Link from "next/link";
import Image from "next/image";

export default function HomeFooter() {
  return (
    <footer className="bg-[var(--neutral-1000)] text-white/55">
      <div className="crib-container flex flex-col gap-10 py-14 pb-10">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="flex max-w-80 flex-col gap-3.5">
            <Image src="/CRIB_LOGO_WHITE.svg" alt="CRIB" width={90} height={18} className="h-[18px] w-auto self-start opacity-90" />
            <p className="text-[13px] leading-relaxed">
              One system for your website, customer data, and everyday tools — designed to be understood.
            </p>
          </div>
          <div className="flex flex-wrap gap-16">
            <div className="flex flex-col gap-2.5 text-[13px]">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/35">Explore</span>
              <Link href="/services" className="text-white/60 transition hover:text-white">Services</Link>
              <Link href="/how-it-works" className="text-white/60 transition hover:text-white">How it works</Link>
              <Link href="/blog" className="text-white/60 transition hover:text-white">Blog</Link>
            </div>
            <div className="flex flex-col gap-2.5 text-[13px]">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/35">Company</span>
              <Link href="/privacy-policy" className="text-white/60 transition hover:text-white">Privacy policy</Link>
              <Link href="/terms" className="text-white/60 transition hover:text-white">Terms of service</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-5 text-xs">© {new Date().getFullYear()} CRIB Network. All rights reserved.</div>
      </div>
    </footer>
  );
}
