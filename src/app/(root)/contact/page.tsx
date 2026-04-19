import { BUSINESS_NAME, BUSINESS_TYPE, BUSINESS_URL } from "@/constants";
import ContactView from "@/features/contact/views/contact-view";
import type { Metadata } from "next";
import Script from "next/script";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Us",
  url: `${BUSINESS_URL}/contact`,
  description: "Get in touch to book your photography or videography session.",
  publisher: {
    "@type": BUSINESS_TYPE,
    name: BUSINESS_NAME,
  },
};

export const metadata: Metadata = {
  title: "Contact Us | Book a DIP Photography Session",
  description:
    "Get in touch to book your photography or videography session. We’d love to capture your special moments—reach out today.",
  keywords: [
    "contact photographer",
    "book photography session",
    "hire photographer",
    "photography inquiry",
  ],
  openGraph: {
    title: "Contact Us",
    description:
      "Reach out to book your next photography or videography session.",
    url: "/contact",
    images: [
      {
        url: "/og/contact.jpg",
        width: 1200,
        height: 630,
        alt: "Contact DIP Photography studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us",
    description:
      "Reach out to book your next photography or videography session.",
    images: ["/og/contact.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <ContactView />

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
