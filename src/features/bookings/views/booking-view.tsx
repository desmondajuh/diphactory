// features/bookings/views/booking-page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Logo } from "@/features/landing/components/nav/logo";
import { client } from "@/lib/orpc";
import { TextareaField } from "@/components/shared/forms/text-area-field";
import { InputField } from "../components/input-field";
import { StepIndicator } from "../components/step-indicator";
import { SessionCard } from "../components/session-card";
import { CircleArrowLeft, HomeIcon } from "lucide-react";
import type {
  BookingSessionType,
  BookingTimeSlot,
} from "@/lib/db/schema/bookings";

const BOOKING_STEPS = ["Session", "Schedule", "Details", "Review"];

interface Props {
  initialSession: string | null;
  sessionTypes: BookingSessionType[];
  timeSlots: BookingTimeSlot[];
  bookedDates: string[];
}

interface FormState {
  sessionTypeId: string;
  date: string;
  timeSlotId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  notes: string;
}

export function BookingPage({
  initialSession,
  sessionTypes,
  timeSlots,
  bookedDates,
}: Props) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlotIds, setBookedSlotIds] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState<FormState>(() => {
    const matched = sessionTypes.find(
      (s) =>
        s.id === initialSession || s.label.toLowerCase() === initialSession,
    );
    return {
      sessionTypeId: matched?.id ?? "",
      date: "",
      timeSlotId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      notes: "",
    };
  });

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const selectedSession = sessionTypes.find((s) => s.id === form.sessionTypeId);
  const selectedSlot = timeSlots.find((t) => t.id === form.timeSlotId);

  // fetch booked slots whenever date changes
  useEffect(() => {
    if (!form.date) return; // nothing to fetch — bookedSlotIds already reset by date onChange

    let cancelled = false;
    // setLoadingSlots(true);

    client.bookings
      .getBookedSlots({ date: form.date })
      .then((ids) => {
        if (!cancelled) setBookedSlotIds(ids);
      })
      .catch(() => {
        if (!cancelled) setBookedSlotIds([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [form.date]);

  const canProceed = [
    !!form.sessionTypeId,
    !!form.date && !!form.timeSlotId,
    !!form.firstName && !!form.lastName && !!form.email,
    true,
  ][step];

  const handleSubmit = async () => {
    if (!selectedSession || !selectedSlot || !form.date) {
      toast.error("Complete the booking details before confirming.");
      return;
    }
    setIsSubmitting(true);
    try {
      await client.bookings.create({
        sessionTypeId: form.sessionTypeId,
        preferredDate: form.date,
        timeSlotId: form.timeSlotId,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        location: form.location || undefined,
        notes: form.notes || undefined,
      });
      setSubmitted(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not submit your booking request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e] px-6">
        <div className="flex max-w-md flex-col items-center text-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-accent-brand/30 bg-accent-brand/10">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent-brand)"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Booking Confirmed
            </p>
            <h2
              className="font-black text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem,5vw,3.5rem)",
                lineHeight: 1,
              }}
            >
              See you soon
              <span className="text-accent-brand">*</span>
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-white/50">
            A confirmation has been sent to{" "}
            <span className="text-white">{form.email}</span>. We&apos;ll be in
            touch within 24 hours.
          </p>
          <div className="w-full rounded-2xl border border-white/8 bg-white/4 p-5 text-left space-y-3">
            {[
              ["Session", selectedSession?.label],
              ["Date", form.date],
              ["Time", selectedSlot?.time],
              ["Name", `${form.firstName} ${form.lastName}`],
              ["Total", `$${selectedSession?.price.toLocaleString()}`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-white/35 uppercase tracking-widest">
                  {label}
                </span>
                <span className="text-sm font-medium text-white">{value}</span>
              </div>
            ))}
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-white/40 underline underline-offset-4 hover:text-white transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#0e0e0e]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/6 bg-[#0e0e0e]/90 px-6 py-4 backdrop-blur-md md:px-10">
        <Logo className="text-lg hidden sm:block" />
        <StepIndicator current={step} total={BOOKING_STEPS.length} />
        <Link
          href="/"
          className="xhidden items-center gap-1.5 text-xs font-medium text-white/35 transition-colors hover:text-white sm:flex"
        >
          <div className="flex sm:hidden p-1 items-center justify-center rounded-full text-md font-bold transition-all duration-300 border border-white/20 bg-accent-brand">
            <HomeIcon className="text-white/70" size="18" />
          </div>
          <CircleArrowLeft className="hidden sm:block" />
          <span className="hidden sm:block">Back</span>
        </Link>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
          <div className="min-w-0">
            {/* Page heading */}
            <div className="mb-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
                {
                  [
                    "Choose your session",
                    "Pick a date & time",
                    "Your details",
                    "Review & confirm",
                  ][step]
                }
              </p>
              <h1
                className="font-black leading-none text-white"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                }}
              >
                {
                  [
                    "Book a Session",
                    "When to Shoot",
                    "Tell Us About You",
                    "Almost There",
                  ][step]
                }
                <span className="text-accent-brand">*</span>
              </h1>
            </div>

            {/* Step 0 — session types from DB */}
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {sessionTypes.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    selected={form.sessionTypeId === session.id}
                    onSelect={() => setField("sessionTypeId", session.id)}
                  />
                ))}
              </div>
            )}

            {/* Step 1 — date + time slots */}
            {step === 1 && (
              <div className="space-y-8">
                {/* Date picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-white/40">
                    Preferred Date <span className="text-accent-brand">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    min={new Date().toISOString().split("T")[0]}
                    // onChange={(e) => {
                    //   setField("date", e.target.value);
                    //   setField("timeSlotId", "");
                    // }}
                    // reset timeSlotId when date changes — handle in the onChange directly
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                        timeSlotId: "", // ← reset slot here, not in useEffect
                      }));
                      setBookedSlotIds([]);
                      setLoadingSlots(true);
                    }}
                    className={cn(
                      "w-full max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                      "outline-none transition-all duration-200 focus:border-white/30 focus:bg-white/8 scheme-dark",
                    )}
                  />
                  {/* Booked date notice */}
                  {form.date && bookedDates.includes(form.date) && (
                    <p className="text-xs text-red-400/70 mt-1">
                      This date is fully booked. Please choose another.
                    </p>
                  )}
                </div>

                {/* Time slots */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                      Available Time Slots
                    </p>
                    {loadingSlots && (
                      <p className="text-[10px] text-white/20 animate-pulse">
                        Checking availability...
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {timeSlots.map((slot) => {
                      const isBooked = bookedSlotIds.includes(slot.id);
                      const isSelected = form.timeSlotId === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={isBooked || loadingSlots}
                          onClick={() =>
                            !isBooked && setField("timeSlotId", slot.id)
                          }
                          className={cn(
                            "group relative rounded-xl border px-4 py-3.5 text-sm font-medium transition-all duration-200",
                            isBooked
                              ? "cursor-not-allowed border-white/5 text-white/15 line-through"
                              : isSelected
                                ? "border-accent-brand bg-accent-brand/10 text-white"
                                : "border-white/10 bg-white/4 text-white/60 hover:border-white/25 hover:text-white",
                          )}
                        >
                          {slot.time}
                          {isBooked && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-white/8 px-2 py-0.5 text-[9px] text-white/25">
                              Booked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location */}
                <InputField
                  label="Preferred Location"
                  id="location"
                  placeholder="Studio, outdoor location, or your address"
                  value={form.location}
                  onChange={(v) => setField("location", v)}
                  hint="We'll confirm a final location after booking."
                />
              </div>
            )}

            {/* Step 2 — client details — unchanged */}
            {step === 2 && (
              <div className="space-y-5 max-w-xl">
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField
                    label="First Name"
                    id="firstName"
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={(v) => setField("firstName", v)}
                    required
                  />
                  <InputField
                    label="Last Name"
                    id="lastName"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={(v) => setField("lastName", v)}
                    required
                  />
                </div>
                <InputField
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={(v) => setField("email", v)}
                  required
                />
                <InputField
                  label="Phone Number"
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(v) => setField("phone", v)}
                  hint="Optional — for day-of coordination."
                />
                <TextareaField
                  label="Vision & Notes"
                  id="notes"
                  placeholder="Describe your vision, mood references, wardrobe ideas…"
                  value={form.notes}
                  onChange={(v) => setField("notes", v)}
                />
              </div>
            )}

            {/* Step 3 — review */}
            {step === 3 && (
              <div className="max-w-xl space-y-4">
                <div className="rounded-2xl border border-white/8 bg-white/3 divide-y divide-white/6 overflow-hidden">
                  {[
                    { label: "Session Type", value: selectedSession?.label },
                    { label: "Duration", value: selectedSession?.duration },
                    { label: "Date", value: form.date || "—" },
                    { label: "Time", value: selectedSlot?.time || "—" },
                    {
                      label: "Location",
                      value: form.location || "To be confirmed",
                    },
                    {
                      label: "Name",
                      value: `${form.firstName} ${form.lastName}`,
                    },
                    { label: "Email", value: form.email },
                    { label: "Phone", value: form.phone || "—" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-4 px-5 py-3.5"
                    >
                      <span className="text-xs font-semibold uppercase tracking-widest text-white/30 shrink-0">
                        {label}
                      </span>
                      <span className="text-sm text-white/80 text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                {form.notes && (
                  <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">
                      Vision & Notes
                    </p>
                    <p className="text-sm leading-relaxed text-white/60">
                      {form.notes}
                    </p>
                  </div>
                )}
                <p className="text-xs leading-relaxed text-white/25">
                  By confirming, you agree to our{" "}
                  <a
                    href="#"
                    className="underline underline-offset-2 hover:text-white/50 transition-colors"
                  >
                    booking terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="underline underline-offset-2 hover:text-white/50 transition-colors"
                  >
                    cancellation policy
                  </a>
                  . A 50% deposit is required to secure your date.
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className={cn(
                  "flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-white/50 transition-all duration-200 hover:border-white/25 hover:text-white",
                  step === 0 && "pointer-events-none opacity-0",
                )}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 12H5M12 5l-7 7 7 7"
                  />
                </svg>
                Previous
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => canProceed && setStep((s) => s + 1)}
                  disabled={!canProceed}
                  className={cn(
                    "flex items-center gap-2.5 rounded-full px-7 py-3 text-sm font-bold transition-all duration-300",
                    canProceed
                      ? "bg-white text-[#0e0e0e] hover:bg-white/90 shadow-lg shadow-white/10"
                      : "cursor-not-allowed bg-white/8 text-white/20",
                  )}
                >
                  Continue
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={isSubmitting}
                  className={cn(
                    "flex items-center gap-2.5 rounded-full px-8 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300",
                    isSubmitting
                      ? "cursor-not-allowed bg-accent-brand/50 shadow-accent-brand/10"
                      : "bg-accent-brand shadow-accent-brand/25 hover:bg-accent-brand/90 hover:shadow-accent-brand/40",
                  )}
                >
                  {isSubmitting ? "Submitting..." : "Confirm Booking"}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Sidebar — unchanged layout */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/3">
                <div className="border-b border-white/6 px-6 py-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                    Booking Summary
                  </p>
                </div>
                <div className="px-6 py-5 space-y-5">
                  {selectedSession ? (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-brand/12 text-accent-brand text-xs font-bold">
                        {selectedSession.label[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {selectedSession.label} Session
                        </p>
                        <p className="text-xs text-white/35">
                          {selectedSession.duration}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-xl bg-white/5" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 rounded bg-white/8" />
                        <div className="h-2.5 w-16 rounded bg-white/5" />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <div className="flex-1 rounded-xl border border-white/6 bg-white/3 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/25">
                        Date
                      </p>
                      <p className="text-sm font-medium text-white">
                        {form.date ? (
                          new Date(form.date + "T00:00:00").toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </p>
                    </div>
                    <div className="flex-1 rounded-xl border border-white/6 bg-white/3 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/25">
                        Time
                      </p>
                      <p className="text-sm font-medium text-white">
                        {selectedSlot?.time ?? (
                          <span className="text-white/20">—</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {(form.firstName || form.lastName) && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-bold text-white/60">
                        {(form.firstName[0] ?? "") + (form.lastName[0] ?? "")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {form.firstName} {form.lastName}
                        </p>
                        {form.email && (
                          <p className="text-xs text-white/35">{form.email}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-white/6" />

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">
                        {selectedSession?.label ?? "Session"} fee
                      </span>
                      <span className="text-sm text-white/70">
                        {selectedSession
                          ? `$${selectedSession.price.toLocaleString()}`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">
                        Deposit due today (50%)
                      </span>
                      <span className="text-sm text-white/70">
                        {selectedSession
                          ? `$${(selectedSession.price / 2).toLocaleString()}`
                          : "—"}
                      </span>
                    </div>
                    <div className="border-t border-white/6 pt-2.5 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                        Total
                      </span>
                      <span className="text-lg font-black text-white">
                        {selectedSession
                          ? `$${selectedSession.price.toLocaleString()}`
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    {[
                      { icon: "shield", text: "Secure & encrypted booking" },
                      {
                        icon: "calendar",
                        text: "Free rescheduling up to 48hrs",
                      },
                      {
                        icon: "refresh",
                        text: "Full refund if cancelled 7+ days",
                      },
                    ].map(({ icon, text }) => (
                      <div key={text} className="flex items-center gap-2.5">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="shrink-0 text-white/25"
                        >
                          {icon === "shield" && (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                            />
                          )}
                          {icon === "calendar" && (
                            <>
                              <rect x="3" y="4" width="18" height="18" rx="2" />
                              <path
                                strokeLinecap="round"
                                d="M16 2v4M8 2v4M3 10h18"
                              />
                            </>
                          )}
                          {icon === "refresh" && (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
                            />
                          )}
                        </svg>
                        <span className="text-[11px] text-white/28">
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-white/20">
                Questions?{" "}
                <a
                  href="mailto:info@diphactory.com"
                  className="text-white/40 underline underline-offset-2 hover:text-white/60 transition-colors"
                >
                  info@diphactory.com
                </a>
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile summary bar */}
      {selectedSession && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/8 bg-[#0e0e0e]/95 px-5 py-3 backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/35">
                {selectedSession.label} · {selectedSession.duration}
              </p>
              <p className="text-base font-black text-white">
                ${selectedSession.price.toLocaleString()}
              </p>
            </div>
            {form.date && selectedSlot && (
              <p className="text-xs text-white/40">
                {new Date(form.date + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {selectedSlot.time}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
