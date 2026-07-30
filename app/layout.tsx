import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Archivo, Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { WebVitals } from '@/components/WebVitals'
import Footer from "@/components/Footer";
import { LazyChatBotProvider } from "@/components/LazyChatBotProvider";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/nav/NavBar";
import JsonLd from "@/components/JsonLd";
import { ConsentManager } from "@/components/ConsentManager";
import {
  organizationStructuredData,
  websiteStructuredData,
} from "@/lib/structured-data";
import { SHARE_IMAGE, SHARE_IMAGE_URL } from "@/lib/share-image";

export const metadata: Metadata = {
  metadataBase: new URL('https://cribnetwork.io'),
  title: {
    default: "CRIB Network | Systems, made clear.",
    template: "%s | CRIB Network",
  },
  description: "CRIB maps and connects the websites, customer data, reporting, and everyday tools beneath your business—then makes them work as one.",
  keywords: [
    "software development",
    "SEO services",
    "social media marketing",
    "web development",
    "digital marketing",
    "CRIB Network",
    "technical SEO",
    "content marketing",
    "startup growth",
  ],
  authors: [{ name: "CRIB Network" }],
  creator: "CRIB Network",
  publisher: "CRIB Network",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cribnetwork.io",
    siteName: "CRIB Network",
    title: "CRIB Network | Systems, made clear.",
    description: "CRIB maps and connects the websites, customer data, reporting, and everyday tools beneath your business—then makes them work as one.",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "CRIB Network | Systems, made clear.",
    description: "CRIB maps and connects the websites, customer data, reporting, and everyday tools beneath your business—then makes them work as one.",
    creator: "@cribnetwork",
    images: [SHARE_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://cribnetwork.io",
  },
};

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap',
  preload: true,
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
  display: 'swap',
  preload: true,
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: 'swap',
  preload: true,
});


const gaId:string = process.env.GA_TAG || process.env.NEXT_PUBLIC_GA_TAG ||"";
const gtmId:string = process.env.GTM_ID || process.env.NEXT_PUBLIC_GTM_ID ||"";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${bebasNeue.variable} ${plexMono.variable}`}
    >
      <head>
        <Script
          id="google-consent-defaults"
          strategy="beforeInteractive"
        >{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
          gtag('set', 'ads_data_redaction', true);
          gtag('set', 'url_passthrough', true);
        `}</Script>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="antialiased">
        <JsonLd data={[organizationStructuredData, websiteStructuredData]} />
        <WebVitals />
        {gtmId ? (
          <GoogleTagManager gtmId={gtmId} />
        ) : gaId ? (
          <GoogleAnalytics gaId={gaId} />
        ) : null}
              <NavBar />

        {children}
        <LazyChatBotProvider/>
        <ConsentManager />
        <Footer/>
        <Toaster />
      </body>
    </html>
  );
}
