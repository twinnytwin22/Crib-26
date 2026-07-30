import type { Metadata } from "next";
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
      <header className="border-b border-foreground bg-background pt-16">
        <div className="crib-container grid gap-10 py-[96px] lg:grid-cols-[0.7fr_1.3fr] lg:py-[120px]">
          <div className="crib-eyebrow">How it works</div>
          <div className="flex flex-col gap-7">
            <h1 className="crib-display max-w-[11em] text-[clamp(50px,7vw,104px)] text-foreground">
              From first call to a system that runs.
            </h1>
            <p className="max-w-[38em] border-l-2 border-primary pl-5 text-[17px] leading-relaxed text-[var(--text-2)]">
              Every engagement follows the same honest sequence. You&apos;ll always know where you are, what comes next, and what you&apos;re getting out of it.
            </p>
          </div>
        </div>
      </header>

      <Timeline />
      <Principles />

      <section id="contact" className="border-b border-foreground bg-background">
        <div className="crib-container grid items-center gap-14 py-[96px] lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
          <div className="flex flex-col gap-4">
            <div className="crib-eyebrow">Step one</div>
            <h2 className="crib-display max-w-[9em] text-[clamp(46px,6vw,78px)] text-foreground">
              Book the intro call.
            </h2>
            <p className="max-w-[32em] border-l-2 border-primary pl-5 text-base leading-relaxed text-[var(--text-2)]">
              Thirty minutes, no obligation. Come with the decision that&apos;s hardest to make right now. We&apos;ll determine fit and explain what we would examine first.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <SiteFooterCompact />
    </div>
  );
}
