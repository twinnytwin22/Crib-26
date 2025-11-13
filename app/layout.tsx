import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import { WebVitals } from '@/components/WebVitals'

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

export const metadata: Metadata = {
  metadataBase: new URL("https://cribnetwork.io"),
  title: {
    default: "CRIB - Connect. Revolutionize. Innovate. Boost.",
    template: "%s | CRIB"
  },
  description: "Full-stack digital growth partner specializing in custom software development, conversion-driven websites, SEO strategy, and social media acceleration.",
  keywords: ["web development", "software development", "SEO", "social media marketing", "digital growth", "SaaS development"],
  authors: [{ name: "Randal Herndon" }],
  creator: "Randal Herndon",
  publisher: "CRIB LLC",
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cribnetwork.io',
    siteName: 'CRIB',
    title: 'CRIB - Connect. Revolutionize. Innovate. Boost.',
    description: 'Full-stack digital growth partner specializing in custom software development, conversion-driven websites, SEO strategy, and social media acceleration.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CRIB - Connect. Revolutionize. Innovate. Boost.',
    description: 'Full-stack digital growth partner specializing in custom software development, conversion-driven websites, SEO strategy, and social media acceleration.',
  },
};

const gaId: string = process.env.GA_TAG || process.env.NEXT_PUBLIC_GA_TAG || "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <link rel="stylesheet" href="https://use.typekit.net/smr3juh.css" />
        <WebVitals />
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {children}
      </body>
    </html>
  );
}
