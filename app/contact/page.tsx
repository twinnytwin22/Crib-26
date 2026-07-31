import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to CRIB about the growth question, system constraint, or digital project your team needs to move forward.",
  alternates: {
    canonical: "https://cribnetwork.io/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="border-b border-foreground bg-background pt-16">
      <div className="crib-container grid items-center gap-14 py-[96px] lg:grid-cols-[0.9fr_1.1fr] lg:py-[120px]">
        <div className="flex flex-col gap-5">
          <div className="crib-eyebrow">Contact / Start here</div>
          <h1 className="crib-display max-w-[9em] text-[clamp(54px,7vw,96px)] text-foreground">
            Talk to us.
          </h1>
          <p className="max-w-[34em] border-l-2 border-primary pl-5 text-[17px] leading-relaxed text-(--text-2)">
            Tell us what your team is trying to move forward and where things feel stuck. We&apos;ll reply within one business day and, if it makes sense, schedule a 30-minute intro call.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-(--text-3)">
            No obligation / A real response from our team
          </p>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
