import type { Metadata } from "next";
import Link from "next/link";
import ServiceOffers from "@/components/services/ServiceOffers";
import Capabilities from "@/components/services/Capabilities";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Understand the growth question, fix the highest-value constraint, and keep the system and roadmap moving.",
  alternates: {
    canonical: "https://cribnetwork.io/services",
  },
};

export default function ServicesPage() {
  return (
    <div>
      <header className="border-b border-foreground bg-background pt-16">
        <div className="crib-container grid gap-10 py-[96px] lg:grid-cols-[0.7fr_1.3fr] lg:py-[120px]">
          <div className="crib-eyebrow">Services</div>
          <div className="flex flex-col gap-7">
            <h1 className="crib-display max-w-[11em] text-[clamp(50px,7vw,104px)] text-foreground">
              Three steps. Each earns the next.
            </h1>
            <p className="max-w-[38em] border-l-2 border-primary pl-5 text-[17px] leading-relaxed text-(--text-2)">
              We start with one priority growth question, map the systems behind it, fix the highest-value constraint, and keep the roadmap moving.
            </p>
          </div>
        </div>
      </header>

      <ServiceOffers />
      <Capabilities />

      <section className="border-y border-foreground bg-primary ">
        <div className="crib-container grid gap-8 py-20 lg:grid-cols-[1fr_auto] lg:items-end lg:py-24">
          <h2 className="crib-display max-w-[12em] text-[clamp(44px,6vw,80px)] text-white">
            Find the right starting point.
          </h2>
          <Button asChild size="lg" variant="inverse">
            <Link  href="/how-it-works">See how the first call works →</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
