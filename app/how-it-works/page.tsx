import type { Metadata } from "next";
import NavBar from "@/components/nav/NavBar";
import Timeline from "@/components/how-it-works/Timeline";
import Principles from "@/components/how-it-works/Principles";
import ContactForm from "@/components/how-it-works/ContactForm";
import SiteFooterCompact from "@/components/SiteFooterCompact";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Every engagement follows the same honest sequence. You'll always know where you are, what comes next, and what you're getting out of it.",
  alternates: {
    canonical: "https://cribnetwork.io/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <div>
      <header className="border-b border-border bg-background pt-14">
        <div className="crib-container flex flex-col gap-4 pt-[88px] pb-[72px]">
          <div className="crib-eyebrow">How it works</div>
          <h1 className="max-w-[16em] text-[clamp(34px,4.6vw,54px)] font-semibold leading-[1.08] tracking-[-0.025em] text-balance text-foreground">
            From first call to a system that runs.
          </h1>
          <p className="max-w-[38em] text-[17px] leading-relaxed text-balance text-[var(--text-2)]">
            Every engagement follows the same honest sequence. You&apos;ll always know where you are, what comes next, and what you&apos;re getting out of it.
          </p>
        </div>
      </header>

      <Timeline />
      <Principles />

      <section id="contact" className="border-b border-border bg-background">
        <div className="crib-container grid items-center gap-14 py-[88px] lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="crib-eyebrow">Step one</div>
            <h2 className="text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.12] tracking-[-0.02em] text-balance text-foreground">
              Book the intro call.
            </h2>
            <p className="max-w-[32em] text-base leading-relaxed text-balance text-[var(--text-2)]">
              Thirty minutes, no obligation. Come with the decision that&apos;s hardest to make right now — we&apos;ll tell you what we&apos;d look at first.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <SiteFooterCompact />
    </div>
  );
}
