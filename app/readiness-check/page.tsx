import type { Metadata } from "next";
import ReadinessCheck from "@/components/readiness-check/ReadinessCheck";

export const metadata: Metadata = {
  title: "Growth Systems Fit Check",
  description: "Take CRIB's two-minute Growth Systems Fit Check for a clear view of your site signals, systems, and the right next move.",
  alternates: { canonical: "https://cribnetwork.io/readiness-check" },
};

export default function ReadinessCheckPage() {
  return <ReadinessCheck />;
}
