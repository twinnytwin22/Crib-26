import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import { WebVitals } from '@/components/WebVitals'
import Footer from "@/components/Footer";
import { ChatBotProvider } from "@/components/ChatBotProvider";

export const metadata: Metadata = {
  metadataBase: new URL('https://cribnetwork.io'),
  title: {
    default: "CRIB Network | Software, SEO & Social Media Marketing",
    template: "%s | CRIB Network",
  },
  description: "Launch software 68% faster, grow organic traffic 140%, and scale pipeline 4x with CRIB's integrated development, SEO, and social media solutions.",
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
    title: "CRIB Network | Software, SEO & Social Media Marketing",
    description: "Launch software 68% faster, grow organic traffic 140%, and scale pipeline 4x with CRIB's integrated development, SEO, and social media solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CRIB Network | Software, SEO & Social Media Marketing",
    description: "Launch software 68% faster, grow organic traffic 140%, and scale pipeline 4x with CRIB's integrated development, SEO, and social media solutions.",
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});


const gaId:string = process.env.GA_TAG || process.env.NEXT_PUBLIC_GA_TAG ||"";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WebVitals />
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {children}
        <ChatBotProvider/>
        <Footer/>
      </body>
    </html>
  );
}
