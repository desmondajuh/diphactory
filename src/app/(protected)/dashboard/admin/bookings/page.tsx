// app/(dashboard)/admin/bookings/page.tsx
import { client } from "@/lib/orpc";
import { BookingsAdminView } from "@/features/admin/views/bookings-admin-view";

export default async function BookingsAdminPage() {
  const [bookings, sessionTypes, timeSlots] = await Promise.all([
    client.bookings.list(),
    client.bookings.listAllSessionTypes(),
    client.bookings.listAllTimeSlots(),
  ]);
  return (
    <BookingsAdminView
      initialBookings={bookings}
      initialSessionTypes={sessionTypes}
      initialTimeSlots={timeSlots}
    />
  );
}
