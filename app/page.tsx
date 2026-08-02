import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Promises from "@/components/home/Promises";
import Problem from "@/components/home/Problem";
import Difference from "@/components/home/Difference";
import Approach from "@/components/home/Approach";
import InPractice from "@/components/home/InPractice";
import WhyCribSection from "@/components/home/WhyCribSection";
import CtaSection from "@/components/home/CtaSection";
import { SHARE_IMAGE, SHARE_IMAGE_URL } from "@/lib/share-image";

export const metadata: Metadata = {
  title: "CRIB Network — Web and Technology, Built for Growth.",
  description:
    "CRIB connects the customer journeys, data, and digital systems behind growth—then fixes the constraint that matters most.",
  openGraph: {
    title: "CRIB Network — Web and Technology, Built for Growth.",
    description:
      "CRIB connects the customer journeys, data, and digital systems behind growth—then fixes the constraint that matters most.",
    images: [SHARE_IMAGE],
  },
  twitter: {
    title: "CRIB Network — Web and Technology, Built for Growth.",
    description:
      "CRIB connects the customer journeys, data, and digital systems behind growth—then fixes the constraint that matters most.",
    images: [SHARE_IMAGE_URL],
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
    </div>
  );
}
