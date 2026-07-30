import type { Metadata } from "next";
import NavBar from "@/components/nav/NavBar";
import Hero from "@/components/home/Hero";
import Promises from "@/components/home/Promises";
import Problem from "@/components/home/Problem";
import Difference from "@/components/home/Difference";
import Approach from "@/components/home/Approach";
import InPractice from "@/components/home/InPractice";
import WhyCribSection from "@/components/home/WhyCribSection";
import CtaSection from "@/components/home/CtaSection";
import HomeFooter from "@/components/home/HomeFooter";

export const metadata: Metadata = {
  title: "CRIB Network — Clarity in your systems. Confidence in your growth.",
  description:
    "CRIB connects your website, customer data, and everyday tools into one system you can see, trust, and grow with.",
  openGraph: {
    title: "CRIB Network — Clarity in your systems. Confidence in your growth.",
    description:
      "CRIB connects your website, customer data, and everyday tools into one system you can see, trust, and grow with.",
  },
  twitter: {
    title: "CRIB Network — Clarity in your systems. Confidence in your growth.",
    description:
      "CRIB connects your website, customer data, and everyday tools into one system you can see, trust, and grow with.",
  },
};

export default function Home() {
  return (
    <div>
      <Hero />
      <Promises />
      <Problem />
      <Difference />
      <Approach />
      <InPractice />
      <WhyCribSection />
      <CtaSection />
      <HomeFooter />
    </div>
  );
}
