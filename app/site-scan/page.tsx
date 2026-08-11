import type { Metadata } from "next";
import ReadinessCheck from "@/components/readiness-check/ReadinessCheck";

const title = "Site Scan";
const description =
  "Measure mobile and desktop site health, inspect analytics and implementation signals, and get a prioritized next move from CRIB.";
const shareImage = {
  url: "/site-scan-og-image.png",
  width: 1732,
  height: 909,
  alt: "CRIB Site Scan",
};

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://cribnetwork.io/site-scan" },
  openGraph: {
    type: "website",
    url: "https://cribnetwork.io/site-scan",
    title,
    description,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [shareImage.url],
  },
};

export default function SiteScanPage() {
  return <ReadinessCheck />;
}
