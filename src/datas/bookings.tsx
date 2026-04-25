import { BookingSessionType, BookingTimeSlot } from "@/types/booking-form";

export const BOOKING_SESSION_TYPES: BookingSessionType[] = [
  {
    id: "portrait",
    label: "Portrait",
    description:
      "Timeless portraits that capture authentic character and presence.",
    duration: "2 hrs",
    price: 450,
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: "editorial",
    label: "Editorial",
    description:
      "High-concept fashion and beauty sessions for print and digital.",
    duration: "4 hrs",
    price: 950,
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    id: "product",
    label: "Product",
    description:
      "Studio-crafted imagery that elevates your brand and product line.",
    duration: "3 hrs",
    price: 700,
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
  {
    id: "event",
    label: "Event",
    description:
      "Dynamic event photography at curated studio and outdoor locations.",
    duration: "5 hrs",
    price: 1400,
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-3h8l3 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="16.5" cy="17.5" r="2.5" />
      </svg>
    ),
  },
];

export const BOOKING_TIME_SLOTS: BookingTimeSlot[] = [
  { id: "t1", time: "8:00 AM", available: true },
  { id: "t2", time: "10:00 AM", available: true },
  { id: "t3", time: "12:00 PM", available: false },
  { id: "t4", time: "2:00 PM", available: true },
  { id: "t5", time: "4:00 PM", available: true },
  { id: "t6", time: "6:00 PM", available: false },
];

export const BOOKING_STEPS = ["Session", "Schedule", "Details", "Review"];
