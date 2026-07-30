import "./globals.css";
import type { Metadata } from "next";
import { Archivo, Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { WebVitals } from '@/components/WebVitals'
import Footer from "@/components/Footer";
import { ChatBotProvider } from "@/components/ChatBotProvider";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/nav/NavBar";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "CRIB Network | Systems, made clear.",
    description: "CRIB maps and connects the websites, customer data, reporting, and everyday tools beneath your business—then makes them work as one.",
    creator: "@cribnetwork",
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
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="antialiased">
        <WebVitals />
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
              <NavBar />

        {children}
        <ChatBotProvider/>
        <Footer/>
        <Toaster />
      </body>
    </html>
  );
}
