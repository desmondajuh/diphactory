// lib/seo/engine.ts

import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/data/site-config";
import { buildJsonLd } from "./jsonld";

type SEOInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
};

const DEFAULT_KEYWORDS = [
  "photography",
  "videography",
  "wedding photographer",
  "portrait photography",
  "creative studio",
];

export async function buildSEO(input: SEOInput = {}) {
  const config = await getSiteConfig();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const businessName = config?.businessName || "My Business";

  const title =
    input.title ||
    config?.metaTitle ||
    `${businessName} | Photography & Videography`;

  const fullTitle = `${title} | ${businessName}`;

  const description =
    input.description ||
    config?.metaDescription ||
    config?.description ||
    "Professional photography and videography services.";

  const path = input.path || "/";
  const url = `${baseUrl}${path}`;

  const image =
    input.image ||
    config?.ogImage ||
    `${baseUrl}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}`;

  const keywords = input.keywords || DEFAULT_KEYWORDS;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords,

    alternates: {
      canonical: url,
    },

    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },

    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: businessName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },

    icons: {
      icon: config?.iconUrl || "/favicon.ico",
    },
  };

  const jsonLd = buildJsonLd(config, url);

  return { metadata, jsonLd };
}
