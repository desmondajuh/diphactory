import type { Metadata } from "next";
import ServicesPage from "@/features/services/views/services-view";
import { BUSINESS_NAME, BUSINESS_URL } from "@/constants";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Photography and Videography",
  provider: {
    "@type": "LocalBusiness",
    name: BUSINESS_NAME,
    url: BUSINESS_URL,
  },
  areaServed: {
    "@type": "Place",
    name: "United States",
  },
  description:
    "Professional photography and videography services including weddings, events, portraits, and commercial shoots.",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

export const metadata: Metadata = {
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
  openGraph: {
    title: "Photography & Videography Services",
    description:
      "Discover tailored photography and videography services for every occasion.",
    url: "/services",
    images: [
      {
        url: "/og/services.jpg",
        width: 1200,
        height: 630,
        alt: "Photography services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photography & Videography Services",
    description:
      "Discover tailored photography and videography services for every occasion.",
    images: ["/og/services.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <ServicesPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
