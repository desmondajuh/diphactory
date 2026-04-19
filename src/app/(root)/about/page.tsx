import AboutView from "@/features/about/views/about-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Book a DIP Photography Session",
  description:
    "Get in touch to book your photography or videography session. We’d love to capture your special moments—reach out today.",
  keywords: [
    "about diai image phactory",
    "book photography session",
    "hire photographer",
    "photography inquiry",
  ],
  openGraph: {
    title: "About Us",
    description:
      "Reach out to book your next photography or videography session.",
    url: "/about",
    images: [
      {
        url: "/og/about.jpg",
        width: 1200,
        height: 630,
        alt: "About DIP Photography studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us",
    description:
      "Reach out to book your next photography or videography session.",
    images: ["/og/about.jpg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutView />
    </>
  );
}
