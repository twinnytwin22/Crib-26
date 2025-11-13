'use client';
import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
<<<<<<< HEAD
import { WebVitals } from '@/components/WebVitals'
=======

>>>>>>> parent of 2206692 (update)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const gaId:string = process.env.GA_TAG || process.env.NEXT_PUBLIC_GA_TAG ||"";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/smr3juh.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WebVitals />
        {gaId && <GoogleAnalytics gaId={gaId} />}
=======
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
              <GoogleAnalytics gaId={gaId} />

>>>>>>> parent of 2206692 (update)
        {children}
      </body>
    </html>
  );
}
