import Link from "next/link";
import Image from "next/image";
import FitCheckLink from "@/components/FitCheckLink";

export default function HomeFooter() {
  return (
    <footer className="bg-(--neutral-1000) text-white/60">
      <div className="crib-container flex flex-col gap-12 py-14 pb-10">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="flex max-w-80 flex-col gap-3.5">
            <Image src="/CRIB_LOGO_WHITE.svg" alt="CRIB" width={90} height={18} className="h-[18px] w-auto self-start opacity-90" />
            <p className="max-w-[28em] text-[13px] leading-relaxed">
              Websites, customer data, reporting, and everyday tools—mapped, connected, and designed to be understood.
            </p>
            <FitCheckLink surface="footer" className="mt-2 w-fit border border-white/40 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition hover:border-white hover:bg-white hover:text-(--neutral-1000)" />
          </div>
          <div className="flex flex-wrap gap-16">
            <div className="flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.08em]">
              <span className="text-[9px] font-semibold text-(--brand-300)">Explore / 01</span>
              <Link href="/services" className="text-white/60 transition hover:text-white">Services</Link>
              <Link href="/how-it-works" className="text-white/60 transition hover:text-white">How it works</Link>
              <Link href="/contact" className="text-white/60 transition hover:text-white">Contact</Link>
              <Link href="/blog" className="text-white/60 transition hover:text-white">Blog</Link>
            </div>
            <div className="flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.08em]">
              <span className="text-[9px] font-semibold text-(--brand-300)">Company / 02</span>
              <Link href="/support" className="text-white/60 transition hover:text-white">Support</Link>
              <Link href="/privacy-policy" className="text-white/60 transition hover:text-white">Privacy policy</Link>
              <Link href="/terms" className="text-white/60 transition hover:text-white">Terms of service</Link>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-white/20 pt-5 font-mono text-[9px] uppercase tracking-[0.08em]">
          <span>© {new Date().getFullYear()} CRIB Network. All rights reserved.</span>
          <span>Phoenix, Arizona / Built to connect</span>
        </div>
      </div>
    </footer>
  );
}
