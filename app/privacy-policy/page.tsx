import PortableBlogText from "@/components/PortableBlogText";
import { getSiteSettings } from "@/lib/providers/sanity/sanity";
import NavBar from "@/components/nav/NavBar";
import type { Metadata } from "next";
import { SHARE_IMAGE, SHARE_IMAGE_URL } from "@/lib/share-image";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Privacy Policy | CRIB Network",
  description: "Learn how CRIB Network collects, uses, and protects your personal information. Your privacy is our priority.",
  openGraph: {
    title: "Privacy Policy | CRIB Network",
    description: "Learn how CRIB Network collects, uses, and protects your personal information. Your privacy is our priority.",
    url: "https://cribnetwork.io/privacy-policy",
    siteName: "CRIB Network",
    locale: "en_US",
    type: "website",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | CRIB Network",
    description: "Learn how CRIB Network collects, uses, and protects your personal information. Your privacy is our priority.",
    images: [SHARE_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://cribnetwork.io/privacy-policy",
  },
};

export default async function Page() {
  const settings = await getSiteSettings();

  if (!settings) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-lg text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy",
    "description": "Privacy policy for CRIB Network services",
    "url": "https://cribnetwork.io/privacy-policy",
    "publisher": {
      "@type": "Organization",
      "name": "CRIB Network",
      "url": "https://cribnetwork.io",
    },
    "dateModified": new Date().toISOString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <NavBar />
      
      {/* Hero Section */}
      <section className="border-b border-border bg-(--neutral-900) pt-28 pb-16 text-white">
        <div className="crib-container max-w-4xl">
          <div className="mb-6 inline-flex rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/72">
            Legal Information
          </div>
          <h1 className="mb-6 text-4xl font-normal leading-tight text-white md:text-6xl">
            Privacy Policy
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/72 md:text-lg">
            Your privacy matters to us. Learn how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="crib-section-tight">
        <div className="crib-container max-w-5xl">
          <article className="crib-card p-6 md:p-10">
            <div className="text-foreground">
              {settings?.privacyPolicy && (
                <PortableBlogText content={settings.privacyPolicy} />
              )}
            </div>
          </article>

          {/* Last Updated */}
          <div className="mt-8 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
