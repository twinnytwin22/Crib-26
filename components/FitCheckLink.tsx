"use client";

import Link from "next/link";
import { Gauge } from "lucide-react";
import { trackMarketingEvent } from "@/lib/analytics";

type FitCheckLinkProps = {
  surface: "primary_nav" | "mobile_nav" | "footer";
  className?: string;
};

export default function FitCheckLink({ surface, className = "" }: FitCheckLinkProps) {
  return (
    <Link
      href="/readiness-check"
      onClick={() => trackMarketingEvent({ event: "fit_check_opened", surface })}
      className={`group inline-flex items-center justify-center gap-1.5 ${className}`}
    >
      <span>Fit Check</span>
      <Gauge aria-hidden="true" className="h-3.5 w-3.5" />
    </Link>
  );
}
