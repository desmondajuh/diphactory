import type { Metadata } from "next";
import TestimonialsView from "@/features/testimonials/views/tesimonials-view";
import { buildSEO } from "@/lib/seo/engine";
import { JsonLd } from "@/components/seo/json-ld";

// 🔥 Replace static metadata with dynamic
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildSEO({
    title: "Testimonials",
    path: "/testimonials",
  });

  return metadata;
}

export default async function TestimonialsPage() {
    const { jsonLd } = await buildSEO({
      title: "Home",
      image: "https://www.diphactory.com/images/bg/bride-bg.jpg", // 🔥 real content
      path: "/",
    });
  
  return (
    <>
  <TestimonialsView />
      <JsonLd data={jsonLd} />
    </>
);
}
