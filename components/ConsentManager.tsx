"use client";

import { useEffect, useState } from "react";

const CONSENT_STORAGE_KEY = "crib_consent_v1";

type ConsentPreferences = {
  analytics: boolean;
  advertising: boolean;
  updatedAt: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function readStoredPreferences(): ConsentPreferences | null {
  try {
    const storedValue = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!storedValue) return null;

    const parsed = JSON.parse(storedValue) as Partial<ConsentPreferences>;
    if (
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.advertising !== "boolean"
    ) {
      return null;
    }

    return {
      analytics: parsed.analytics,
      advertising: parsed.advertising,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function updateGoogleConsent(preferences: ConsentPreferences) {
  window.gtag?.("consent", "update", {
    analytics_storage: preferences.analytics ? "granted" : "denied",
    ad_storage: preferences.advertising ? "granted" : "denied",
    ad_user_data: preferences.advertising ? "granted" : "denied",
    ad_personalization: preferences.advertising ? "granted" : "denied",
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "consent_update",
    consent_analytics: preferences.analytics ? "granted" : "denied",
    consent_advertising: preferences.advertising ? "granted" : "denied",
  });
}

export function ConsentManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDecision, setHasDecision] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    const storedPreferences = readStoredPreferences();
    if (!storedPreferences) {
      setIsOpen(true);
      return;
    }

    setAnalytics(storedPreferences.analytics);
    setAdvertising(storedPreferences.advertising);
    setHasDecision(true);
    updateGoogleConsent(storedPreferences);
  }, []);

  const savePreferences = (
    nextAnalytics: boolean,
    nextAdvertising: boolean
  ) => {
    const preferences: ConsentPreferences = {
      analytics: nextAnalytics,
      advertising: nextAdvertising,
      updatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify(preferences)
    );
    setAnalytics(nextAnalytics);
    setAdvertising(nextAdvertising);
    setHasDecision(true);
    setIsOpen(false);
    setShowDetails(false);
    updateGoogleConsent(preferences);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-60 border border-foreground bg-card px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground shadow-lg transition-colors hover:bg-foreground hover:text-background"
        aria-label="Open privacy preferences"
      >
        Privacy
      </button>
    );
  }

  return (
    <section
      aria-label="Privacy preferences"
      className="fixed bottom-4 left-4 z-60 w-[min(360px,calc(100vw-32px))] border border-foreground bg-card text-foreground shadow-2xl"
    >
      <div className="border-b border-foreground bg-(--neutral-900) px-5 py-4 text-white">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white/65">
          Privacy controls
        </p>
        <h2 className="mt-1 text-xl font-normal leading-tight">
          Your data. Your choice.
        </h2>
      </div>

      <div className="p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          We use necessary storage to run this site. With your permission,
          analytics helps us understand what works. Advertising storage is
          optional and remains off unless you enable it.
        </p>

        {showDetails && (
          <div className="mt-5 border-y border-border">
            <div className="flex items-start justify-between gap-4 border-b border-border py-4">
              <div>
                <p className="text-sm font-semibold">Necessary</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Security, preference storage, and core site operation.
                </p>
              </div>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Always on
              </span>
            </div>

            <label className="flex cursor-pointer items-start justify-between gap-4 border-b border-border py-4">
              <span>
                <span className="block text-sm font-semibold">Analytics</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  Measures visits and successful inquiries without sending form
                  or chat content.
                </span>
              </span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="mt-1 h-4 w-4 accent-primary"
              />
            </label>

            <label className="flex cursor-pointer items-start justify-between gap-4 py-4">
              <span>
                <span className="block text-sm font-semibold">Advertising</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  Enables advertising measurement and personalization signals.
                </span>
              </span>
              <input
                type="checkbox"
                checked={advertising}
                onChange={(event) => setAdvertising(event.target.checked)}
                className="mt-1 h-4 w-4 accent-primary"
              />
            </label>
          </div>
        )}

        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={() => savePreferences(true, true)}
            className="min-h-11 border border-primary bg-primary px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-foreground hover:bg-foreground"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() =>
              showDetails || hasDecision
                ? savePreferences(analytics, advertising)
                : savePreferences(false, false)
            }
            className="min-h-11 border border-foreground bg-transparent px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors hover:bg-foreground hover:text-background"
          >
            {showDetails
              ? "Save preferences"
              : hasDecision
                ? "Keep current choice"
                : "Necessary only"}
          </button>
          <button
            type="button"
            onClick={() => setShowDetails((current) => !current)}
            className="min-h-9 px-3 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {showDetails ? "Hide details" : "Manage choices"}
          </button>
        </div>

        <a
          href="/privacy-policy"
          className="mt-3 block text-center font-mono text-[9px] uppercase tracking-[0.06em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Read the privacy policy
        </a>
      </div>
    </section>
  );
}
