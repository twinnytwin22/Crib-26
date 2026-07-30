import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/nav/NavBar";
import ServiceOffers from "@/components/services/ServiceOffers";
import Capabilities from "@/components/services/Capabilities";
import SiteFooterCompact from "@/components/SiteFooterCompact";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "We don't start with a rebuild, a platform, or a pitch deck of everything you could buy. We start by understanding your systems — then fix what matters most, and stay to keep it working.",
  alternates: {
    canonical: "https://cribnetwork.io/services",
  },
};

export default function ServicesPage() {
  return (
    <div>
      <NavBar />
      <header className="border-b border-border bg-background pt-14">
        <div className="crib-container flex flex-col gap-4 pt-[88px] pb-[72px]">
          <div className="crib-eyebrow">Services</div>
          <h1 className="max-w-[16em] text-[clamp(34px,4.6vw,54px)] font-semibold leading-[1.08] tracking-[-0.025em] text-balance text-foreground">
            Three steps. Each one earns the next.
          </h1>
          <p className="max-w-[38em] text-[17px] leading-relaxed text-balance text-[var(--text-2)]">
            We don&apos;t start with a rebuild, a platform, or a pitch deck of everything you could buy. We start by understanding your systems — then fix what matters most, and stay to keep it working.
          </p>
        </div>
      </header>

      <ServiceOffers />
      <Capabilities />

      <section className="bg-[var(--neutral-900)] text-white">
        <div className="crib-container flex flex-col items-start gap-4.5 py-20">
          <h2 className="max-w-[18em] text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.12] tracking-[-0.02em] text-balance">
            Not sure which step you need? That&apos;s the point of the first call.
          </h2>
          <Button asChild size="lg" className="mt-1">
            <Link href="/how-it-works">Book an intro call</Link>
          </Button>
        </div>
      </section>

      <SiteFooterCompact />
    </div>
  );
}
