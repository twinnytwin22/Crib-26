import PortableBlogText from "@/components/PortableBlogText";
import { getSiteSettings } from "@/lib/providers/sanity/sanity";
import NavBar from "@/components/nav/NavBar";
import type { Metadata } from "next";
import { SHARE_IMAGE, SHARE_IMAGE_URL } from "@/lib/share-image";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Terms & Conditions | CRIB Network",
  description: "Read our terms and conditions to understand the rules and regulations governing the use of CRIB Network's services.",
  openGraph: {
    title: "Terms & Conditions | CRIB Network",
    description: "Read our terms and conditions to understand the rules and regulations governing the use of CRIB Network's services.",
    url: "https://cribnetwork.io/terms",
    siteName: "CRIB Network",
    locale: "en_US",
    type: "website",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | CRIB Network",
    description: "Read our terms and conditions to understand the rules and regulations governing the use of CRIB Network's services.",
    images: [SHARE_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://cribnetwork.io/terms",
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
    "name": "Terms & Conditions",
    "description": "Terms and conditions for CRIB Network services",
    "url": "https://cribnetwork.io/terms",
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
      <section className="border-b border-border bg-[var(--neutral-900)] pt-28 pb-16 text-white">
        <div className="crib-container max-w-4xl">
          <div className="mb-6 inline-flex rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/72">
            Legal Information
          </div>
          <h1 className="mb-6 text-4xl font-normal leading-tight text-white md:text-6xl">
            Terms & Conditions
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/72 md:text-lg">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="crib-section-tight">
        <div className="crib-container max-w-5xl">
          <article className="crib-card p-6 md:p-10">
            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-normal prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground">
              {settings?.termsConditions && (
                <PortableBlogText content={settings.termsConditions} />
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
