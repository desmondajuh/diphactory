// import Script from "next/script";
import type { Metadata } from "next";

import { HomeView } from "@/features/landing/views/home-view";
import { buildSEO } from "@/lib/seo/engine";
import { JsonLd } from "@/components/seo/json-ld";

// 🔥 Replace static metadata with dynamic
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildSEO({
    title: "Home",
    path: "/",
  });

  return metadata;
}

export default async function HomePage() {
  const { jsonLd } = await buildSEO({
    title: "Home",
    image: "https://www.diphactory.com/images/bg/bride-bg.jpg", // 🔥 real content
    path: "/",
  });

  return (
    <>
      <HomeView />
      <JsonLd data={jsonLd} />
    </>
  );
}
