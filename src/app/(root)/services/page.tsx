import type { Metadata } from "next";
import ServicesPage from "@/features/services/views/services-view";
import { buildSEO } from "@/lib/seo/engine";
import { JsonLd } from "@/components/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildSEO({
    title: "DIP Photography & Videography Services",
    description:
      "Explore our professional photography and videography services including weddings, events, portraits, and commercial shoots. Tailored packages available.",
    keywords: [
      "photography services",
      "videography services",
      "wedding packages",
      "event photography",
      "studio sessions",
    ],
    path: "/services",
  });

  return metadata;
}

export default async function Page() {
  const { jsonLd } = await buildSEO({
    title: "Bookings | Book a Photography Session",
    image: "https://www.diphactory.com/images/bg/bride-bg.jpg", 
    path: "/bookings",
  });
  return (
    <>
      <ServicesPage />
      <JsonLd data={jsonLd} />
    </>
  );
}
