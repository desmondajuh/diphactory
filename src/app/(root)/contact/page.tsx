import ContactView from "@/features/contact/views/contact-view";
import type { Metadata } from "next";
import { buildSEO } from "@/lib/seo/engine";
import { JsonLd } from "@/components/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildSEO({
    title: "Contact Us | Book a DIP Photography Session",
    description:
      "Get in touch to book your photography or videography session. We’d love to capture your special moments—reach out today.",
    keywords: [
      "contact photographer",
      "book photography session",
      "hire photographer",
      "photography inquiry",
    ],
    path: "/contact",
  });

  return metadata;
}

export default async function Page() {
  const { jsonLd } = await buildSEO({
    title: "Bookings | Book a Photography Session",
    image: "https://www.diphactory.com/images/bg/bride-bg.jpg", // 🔥 real content
    path: "/bookings",
  });

  return (
    <>
      <ContactView />
      <JsonLd data={jsonLd} />
    </>
  );
}
