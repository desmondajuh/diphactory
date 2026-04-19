import { BUSINESS_URL, BUSINESS_TYPE, BUSINESS_NAME } from "@/constants";
import GalleryView from "@/features/gallery/views/gallery-view";
import type { Metadata } from "next";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Photography Gallery",
  url: `${BUSINESS_URL}/gallery`,
  description:
    "Browse our curated photography gallery featuring weddings, portraits, and creative shoots.",
  publisher: {
    "@type": BUSINESS_TYPE,
    name: BUSINESS_NAME,
  },
};

export const metadata: Metadata = {
  title: "Photography Gallery | Our Work",
  description:
    "Browse our curated photography gallery showcasing weddings, portraits, fashion, and lifestyle shoots. Discover our signature visual style.",
  keywords: [
    "photo gallery",
    "portfolio photography",
    "wedding gallery",
    "portrait gallery",
    "creative photography",
  ],
  openGraph: {
    title: "Photography Gallery",
    description:
      "Explore our portfolio of stunning photography across various styles and moments.",
    url: "/gallery",
    images: [
      {
        url: "/og/gallery.jpg",
        width: 1200,
        height: 630,
        alt: "Photography gallery preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photography Gallery",
    description:
      "Explore our portfolio of stunning photography across various styles.",
    images: ["/og/gallery.jpg"],
  },
};

export default function GalleryPage() {
  return (
    <>
      <GalleryView />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
