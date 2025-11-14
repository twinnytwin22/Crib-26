import PortableBlogText from "@/components/PortableBlogText";
import { getSiteSettings } from "@/lib/providers/sanity/sanity";
import NavBar from "@/components/nav/NavBar";
import type { Metadata } from "next";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | CRIB Network",
    description: "Read our terms and conditions to understand the rules and regulations governing the use of CRIB Network's services.",
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
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
        <NavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-slate-400 text-lg">Loading...</div>
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
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
        <NavBar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 py-24 px-6">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white backdrop-blur-sm">
            Legal Information
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            Terms & Conditions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Please read these terms carefully before using our services.
          </p>
        </div>
        
        {/* Decorative gradient orbs */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </section>

      {/* Content Section */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <article className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 md:p-12 lg:p-16">
            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-ul:text-slate-700 prose-ol:text-slate-700">
              {settings?.termsConditions && (
                <PortableBlogText content={settings.termsConditions} />
              )}
            </div>
          </article>

          {/* Last Updated */}
          <div className="mt-8 text-center text-sm text-slate-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
