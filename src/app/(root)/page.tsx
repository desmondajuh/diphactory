import Script from "next/script";
import type { Metadata } from "next";
import {
  BUSINESS_ADDRESS,
  BUSINESS_INSTAGRAM_URL,
  BUSINESS_NAME,
  BUSINESS_TELEPHONE,
  BUSINESS_TWITTER_URL,
  BUSINESS_TYPE,
  BUSINESS_URL,
} from "@/constants";
import { HomeView } from "@/features/landing/views/home-view";

const structuredData = {
  "@context": "https://schema.org",
  "@type": BUSINESS_TYPE,
  name: BUSINESS_NAME,
  image: `${BUSINESS_URL}/og/home.jpg`,
  url: BUSINESS_URL,
  telephone: BUSINESS_TELEPHONE,
  address: BUSINESS_ADDRESS,
  sameAs: [BUSINESS_INSTAGRAM_URL, BUSINESS_TWITTER_URL],
  description:
    "Professional photography and videography services specializing in weddings, portraits, and cinematic storytelling.",
  priceRange: "$$",
  areaServed: "US",
  serviceType: ["Wedding Photography", "Portrait Photography", "Videography"],
};

export const metadata: Metadata = {
  title: `${BUSINESS_NAME} | Photography & Videography | Capturing Timeless Moments`,
  description:
    "Professional photography and videography services specializing in weddings, portraits, and cinematic storytelling. Explore stunning visuals and book your session today.",
  keywords: [
    "photography",
    "videography",
    "wedding photographer",
    "portrait photography",
    "creative studio",
    "cinematic video",
  ],
  openGraph: {
    title: `${BUSINESS_NAME} | Photography & Videography`,
    description:
      "Capturing timeless moments through stunning photography and cinematic video.",
    url: "/",
    siteName: BUSINESS_NAME,
    images: [
      {
        url: "/og/home.jpg",
        width: 1200,
        height: 630,
        alt: "Photography showcase",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Photography & Videography",
    description:
      "Capturing timeless moments through stunning photography and cinematic video.",
    images: ["/og/home.jpg"],
  },
};

export default function HomePage() {
  return (
    <>
      <HomeView />
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
