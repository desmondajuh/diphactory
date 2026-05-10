import GalleryView from "@/features/gallery/views/gallery-view";
import type { Metadata } from "next";
import { buildSEO } from "@/lib/seo/engine";
import { JsonLd } from "@/components/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildSEO({
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
    path: "/gallery",
  });

  return metadata;
}

export default async function GalleryPage() {
  const { jsonLd } = await buildSEO({
    title: "Bookings | Book a Photography Session",
    image: "https://www.diphactory.com/images/bg/bride-bg.jpg", // 🔥 real content
    path: "/bookings",
  });

  return (
    <>
      <GalleryView />
      <JsonLd data={jsonLd} />
    </>
  );
}
