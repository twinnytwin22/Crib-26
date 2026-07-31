import type { Metadata } from "next";
import ReadinessCheck from "@/components/readiness-check/ReadinessCheck";

export const metadata: Metadata = {
  title: "Site Performance Check",
  description: "Measure mobile and desktop site health, inspect analytics and implementation signals, and get a prioritized next move from CRIB.",
  alternates: { canonical: "https://cribnetwork.io/readiness-check" },
};

export default function ReadinessCheckPage() {
  return <ReadinessCheck />;
}
