import type { Metadata } from "next";
import { BUSINESS_NAME, BUSINESS_TYPE, BUSINESS_URL } from "@/constants";
import BookingPage from "@/features/bookings/views/booking-view";
import Script from "next/script";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "BookingsPage",
  name: "Bookings",
  url: `${BUSINESS_URL}/bookings`,
  description: "Get in touch to book your photography or videography session.",
  publisher: {
    "@type": BUSINESS_TYPE,
    name: BUSINESS_NAME,
  },
};

export const metadata: Metadata = {
  title: "Bookings | Book a Photography Session",
  description:
    "Book your photography session with DIP. Portrait, outdoor, event, editorial, product, and automotive photography. Schedule your session today and capture your special moments with us.",
  keywords: [
    "contact photographer",
    "book photography session",
    "hire photographer",
    "photography inquiry",
  ],
  openGraph: {
    title: "Bookings",
    description:
      "Reach out to book your next photography or videography session.",
    url: "/bookings",
    images: [
      {
        url: "/og/bookings.jpg",
        width: 1200,
        height: 630,
        alt: "Book photography studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookings",
    description:
      "Reach out to book your next photography or videography session.",
    images: ["/og/bookings.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <BookingPage />
      <Script
        id="structured-data-bookings"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
