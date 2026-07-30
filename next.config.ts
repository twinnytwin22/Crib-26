import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "same-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(self), camera=(self), geolocation=(self), microphone=(self)",
  },
];

const publicAssetCacheHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=86400, stale-while-revalidate=604800",
  },
];

const cachedPublicAssets = [
  "/og.png",
  "/brand-graphics/:path*",
  "/flowr-bg.jpg",
  "/wall-bg.jpg",
  "/retention.jpg",
  "/leadership-reporting.jpg",
  "/manual-work.jpg",
  "/pexels-atypeek-10323634.jpg",
  "/pexels-cottonbro-7439127.jpg",
  "/pexels-jakubzerdzicki-36950598.jpg",
  "/pexels-jakubzerdzicki-36950633.jpg",
  "/pexels-lucas-george-wendt-2279952-4519864.jpg",
  "/pexels-moe-magners-7495291.jpg",
  "/pexels-pixabay-248515.jpg",
  "/pexels-silverkblack-36730432.jpg",
  "/pexels-spoton-pos-2160258094-37594388.jpg",
  "/pexels-thisisengineering-3861943.jpg",
  "/pexels-yankrukov-7693745.jpg",
  "/CRIB_ICON.png",
  "/CRIB_LOGO.svg",
  "/CRIB_LOGO_RED.svg",
  "/CRIB_LOGO_WHITE.svg",
  "/BebasNeue-Regular.ttf",
];

const nextConfig: NextConfig = {
  compress: true, // Enable gzip compression
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: false,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      ...cachedPublicAssets.map((source) => ({
        source,
        headers: publicAssetCacheHeaders,
      })),
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Cache-Control",
            value: "private, no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
