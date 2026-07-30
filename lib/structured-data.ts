const SITE_URL = "https://cribnetwork.io";

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "CRIB",
  legalName: "CRIB, LLC",
  url: SITE_URL,
  logo: `${SITE_URL}/CRIB_ICON.png`,
  email: "support@cribnetwork.io",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Phoenix",
    addressRegion: "AZ",
    addressCountry: "US",
  },
};

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "CRIB",
  url: SITE_URL,
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  inLanguage: "en-US",
};

export function articleStructuredData({
  title,
  description,
  slug,
  image,
  publishedAt,
  updatedAt,
}: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
}) {
  const url = `${SITE_URL}/post/${slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: title,
      description,
      url,
      mainEntityOfPage: url,
      ...(image ? { image: [image] } : {}),
      ...(publishedAt ? { datePublished: publishedAt } : {}),
      ...(updatedAt ? { dateModified: updatedAt } : {}),
      author: {
        "@type": "Person",
        name: "Randal Herndon",
      },
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${SITE_URL}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: title,
          item: url,
        },
      ],
    },
  ];
}
