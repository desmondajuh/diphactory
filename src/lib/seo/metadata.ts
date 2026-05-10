// lib/seo/metadata.ts

import type { Metadata } from "next";

type SEOInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
};

const DEFAULTS = {
  title: "Photography & Videography | Capturing Timeless Moments",
  description:
    "Professional photography and videography services specializing in weddings, portraits, and cinematic storytelling.",
  image: "/og/home.jpg",
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
}: SEOInput = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${process.env.NEXT_PUBLIC_BUSINESS_NAME}`
    : `${process.env.NEXT_PUBLIC_BUSINESS_NAME} | ${DEFAULTS.title}`;

  const finalDescription = description ?? DEFAULTS.description;
  const finalImage = image ?? DEFAULTS.image;

  return {
    title: fullTitle,
    description: finalDescription,

    openGraph: {
      title: fullTitle,
      description: finalDescription,
      url: path,
      siteName: process.env.NEXT_PUBLIC_BUSINESS_NAME,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: finalDescription,
      images: [finalImage],
    },
  };
}
