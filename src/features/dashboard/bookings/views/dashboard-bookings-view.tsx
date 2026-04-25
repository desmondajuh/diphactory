"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDaysIcon,
  Clock3Icon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/lib/orpc";
import { DashboardShell } from "../../components/dashboard-shell";

type BookingItem = Awaited<ReturnType<typeof client.bookings.list>>[number];
type BookingStatus = BookingItem["status"];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function DashboardBookingsView() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadBookings() {
    setIsLoading(true);
    setError(null);

    try {
      const rows = await client.bookings.list();
      setBookings(rows);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load bookings.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadBookings();
  }, []);

  async function updateStatus(bookingId: string, status: BookingStatus) {
    try {
      const updated = await client.bookings.updateStatus({ bookingId, status });
      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId ? updated : booking,
        ),
      );
      toast.success("Booking status updated.");
    } catch (updateError) {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Could not update booking status.",
      );
    }
  }

  return (
    <DashboardShell
      eyebrow="Booking Requests"
      title="Review incoming booking requests from the public bookings page."
      description="Every confirmed booking request from the public form lands here for admin review and status updates."
    >
      {isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border border-border/70 bg-card/80">
              <CardHeader>
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-44" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border border-destructive/30 bg-destructive/5">
          <CardContent className="py-10 text-sm text-muted-foreground">
            {error}
          </CardContent>
        </Card>
      ) : bookings.length === 0 ? (
        <Card className="border border-dashed border-border/70 bg-card/70">
          <CardContent className="py-10 text-sm text-muted-foreground">
            No bookings submitted yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {bookings.map((booking) => (
            <Card key={booking.id} className="border border-border/70 bg-card/90 py-0">
              <CardHeader className="border-b border-border/70 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle>
                      {booking.firstName} {booking.lastName}
                    </CardTitle>
                    <CardDescription>{booking.sessionType}</CardDescription>
                  </div>
                  <select
                    value={booking.status}
                    onChange={(event) =>
                      void updateStatus(
                        booking.id,
                        event.target.value as BookingStatus,
                      )
                    }
                    className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoLine icon={MailIcon} label="Email" value={booking.email} />
                  <InfoLine
                    icon={PhoneIcon}
                    label="Phone"
                    value={booking.phone || "Not provided"}
                  />
                  <InfoLine
                    icon={CalendarDaysIcon}
                    label="Preferred date"
                    value={booking.preferredDate}
                  />
                  <InfoLine
                    icon={Clock3Icon}
                    label="Time slot"
                    value={booking.timeSlot}
                  />
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <MapPinIcon className="size-3.5" />
                    <span>Location</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.location || "No location provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Notes
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.notes || "No additional notes"}
                  </p>
                </div>

                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Submitted {formatDate(booking.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/50 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Icon className="size-3.5" />
        <span>{label}</span>
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
