import type { Metadata } from "next";
import { BookingPage } from "@/features/bookings/views/booking-view";
import { client } from "@/lib/orpc";
import { buildSEO } from "@/lib/seo/engine";
import { JsonLd } from "@/components/seo/json-ld";

// 🔥 Replace static metadata with dynamic
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildSEO({
    title: "Bookings | Book a Photography Session",
    description:
      "Book your photography session with DIP. Portrait, outdoor, event, editorial, product, and automotive photography. Schedule your session today and capture your special moments with us.",
    keywords: [
      "contact photographer",
      "book photography session",
      "hire photographer",
      "photography inquiry",
    ],
    path: "/bookings",
  });

  return metadata;
}

type PageProps = {
  searchParams: Promise<{
    session?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const initialSession = resolvedParams.session?.toLowerCase() ?? null;

  const [sessionTypes, timeSlots, bookedDates] = await Promise.all([
    client.bookings.listSessionTypes(),
    client.bookings.listTimeSlots(),
    client.bookings.getBookedDates(),
  ]);

  const { jsonLd } = await buildSEO({
    title: "Bookings | Book a Photography Session",
    image: "https://www.diphactory.com/images/bg/bride-bg.jpg", // 🔥 real content
    path: "/bookings",
  });

  return (
    <>
      <BookingPage
        initialSession={initialSession}
        sessionTypes={sessionTypes}
        timeSlots={timeSlots}
        bookedDates={bookedDates}
      />
      <JsonLd data={jsonLd} />
    </>
  );
}
