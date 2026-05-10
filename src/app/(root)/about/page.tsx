import { JsonLd } from "@/components/seo/json-ld";
import AboutView from "@/features/about/views/about-view";
import { buildSEO } from "@/lib/seo/engine";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildSEO({
    title: "About Us | Book a DIP Photography Session",
    path: "/",
  });

  return metadata;
}

export default async function AboutPage() {
  const { jsonLd } = await buildSEO({
    title: "About Us | Book a DIP Photography Session",
    image: "https://www.diphactory.com/images/bg/bride-bg.jpg", // 🔥 real content
    path: "/",
  });
  return (
    <>
      <AboutView />
      <JsonLd data={jsonLd} />
    </>
  );
}
