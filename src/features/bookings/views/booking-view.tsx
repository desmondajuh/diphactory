"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/features/landing/components/nav/logo";
// import { Logo } from "@/components/nav/logo";

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionType = {
  id: string;
  label: string;
  description: string;
  duration: string;
  price: number;
  icon: React.ReactNode;
};

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

type FormState = {
  sessionType: string;
  date: string;
  timeSlot: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  notes: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const SESSION_TYPES: SessionType[] = [
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
    id: "automotive",
    label: "Automotive",
    description:
      "Dynamic automotive photography at curated studio and outdoor locations.",
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

const TIME_SLOTS: TimeSlot[] = [
  { id: "t1", time: "8:00 AM", available: true },
  { id: "t2", time: "10:00 AM", available: true },
  { id: "t3", time: "12:00 PM", available: false },
  { id: "t4", time: "2:00 PM", available: true },
  { id: "t5", time: "4:00 PM", available: true },
  { id: "t6", time: "6:00 PM", available: false },
];

const STEPS = ["Session", "Schedule", "Details", "Review"];

// ─── Sub-components ────────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300",
                i < current
                  ? "bg-accent-red text-white"
                  : i === current
                    ? "bg-white text-[#0e0e0e]"
                    : "border border-white/20 text-white/30",
              )}
            >
              {i < current ? (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={cn(
                "hidden text-xs font-medium tracking-wide sm:block transition-colors duration-300",
                i === current
                  ? "text-white"
                  : i < current
                    ? "text-white/60"
                    : "text-white/25",
              )}
            >
              {label}
            </span>
          </div>
          {i < total - 1 && (
            <div
              className={cn(
                "h-px w-6 transition-colors duration-300",
                i < current ? "bg-accent-red" : "bg-white/15",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SessionCard({
  session,
  selected,
  onSelect,
}: {
  session: SessionType;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative w-full rounded-2xl border p-5 text-left transition-all duration-300",
        selected
          ? "border-accent-red bg-accent-red/8"
          : "border-white/10 bg-white/4 hover:border-white/25 hover:bg-white/7",
      )}
    >
      {/* Selected indicator */}
      {selected && (
        <div className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-accent-red">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      <div
        className={cn(
          "mb-3 transition-colors duration-200",
          selected
            ? "text-accent-red"
            : "text-white/50 group-hover:text-white/75",
        )}
      >
        {session.icon}
      </div>

      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-base font-semibold text-white">
          {session.label}
        </span>
        <span className="text-sm font-bold text-white">
          ${session.price.toLocaleString()}
        </span>
      </div>

      <p className="mb-3 text-xs leading-relaxed text-white/45">
        {session.description}
      </p>

      <div className="flex items-center gap-1.5">
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="text-white/35"
        >
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 6v6l4 2" />
        </svg>
        <span className="text-[11px] text-white/40">{session.duration}</span>
      </div>
    </button>
  );
}

function InputField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  hint,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-white/40"
      >
        {label}
        {required && <span className="text-accent-red">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={cn(
          "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20",
          "outline-none transition-all duration-200",
          "focus:border-white/30 focus:bg-white/8 focus:ring-1 focus:ring-white/10",
          "hover:border-white/18",
        )}
      />
      {hint && <p className="text-[11px] text-white/25">{hint}</p>}
    </div>
  );
}

function TextareaField({
  label,
  id,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  id: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-widest text-white/40"
      >
        {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={cn(
          "resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20",
          "outline-none transition-all duration-200",
          "focus:border-white/30 focus:bg-white/8 focus:ring-1 focus:ring-white/10",
          "hover:border-white/18",
        )}
      />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormState>({
    sessionType: "",
    date: "",
    timeSlot: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    notes: "",
  });

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const selectedSession = SESSION_TYPES.find((s) => s.id === form.sessionType);
  const selectedSlot = TIME_SLOTS.find((t) => t.id === form.timeSlot);

  const canProceed = [
    !!form.sessionType,
    !!form.date && !!form.timeSlot,
    !!form.firstName && !!form.lastName && !!form.email,
    true,
  ][step];

  const handleSubmit = () => {
    setSubmitted(true);
  };

  // ── Success Screen ──
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e] px-6">
        <div className="flex max-w-md flex-col items-center text-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-accent-red/30 bg-accent-red/10">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent-red)"
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
              <span style={{ color: "var(--color-accent-red)" }}>*</span>
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-white/50">
            A confirmation has been sent to{" "}
            <span className="text-white">{form.email}</span>. We&apos;ll be in
            touch within 24 hours to finalise the details.
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

  // ── Main Layout ──
  return (
    <div
      className="min-h-screen bg-[#0e0e0e]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Subtle grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/6 bg-[#0e0e0e]/90 px-6 py-4 backdrop-blur-md md:px-10">
        {/* <Link
          href="/"
          className="flex items-center gap-0.5 font-black uppercase tracking-widest text-white text-lg"
          style={{ fontFamily: "var(--font-display)" }}
        >
          DIPHACTORY
          <span style={{ color: "var(--color-accent-red)", fontSize: "1.3em" }}>
            *
          </span>
        </Link> */}
        <Logo className="text-lg" />
        <StepIndicator current={step} total={STEPS.length} />
        <Link
          href="/"
          className="hidden items-center gap-1.5 text-xs font-medium text-white/35 transition-colors hover:text-white sm:flex"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 12H5M12 5l-7 7 7 7"
            />
          </svg>
          Back
        </Link>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
          {/* ── Left: Form area ── */}
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
                <span style={{ color: "var(--color-accent-red)" }}>*</span>
              </h1>
            </div>

            {/* ── STEP 0: Session type ── */}
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {SESSION_TYPES.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    selected={form.sessionType === session.id}
                    onSelect={() => setField("sessionType", session.id)}
                  />
                ))}
              </div>
            )}

            {/* ── STEP 1: Date & time ── */}
            {step === 1 && (
              <div className="space-y-8">
                {/* Date picker */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="date"
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-white/40"
                  >
                    Preferred Date{" "}
                    <span className="text-(--color-accent-red)">*</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={form.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setField("date", e.target.value)}
                    className={cn(
                      "w-full max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                      "outline-none transition-all duration-200 focus:border-white/30 focus:bg-white/8",
                      "scheme-dark",
                    )}
                  />
                </div>

                {/* Time slots */}
                <div>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                    Available Time Slots
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() =>
                          slot.available && setField("timeSlot", slot.id)
                        }
                        className={cn(
                          "group relative rounded-xl border px-4 py-3.5 text-sm font-medium transition-all duration-200",
                          !slot.available
                            ? "cursor-not-allowed border-white/5 text-white/15 line-through"
                            : form.timeSlot === slot.id
                              ? "border-accent-red bg-accent-red/10 text-white"
                              : "border-white/10 bg-white/4 text-white/60 hover:border-white/25 hover:text-white",
                        )}
                      >
                        {slot.time}
                        {!slot.available && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-white/8 px-2 py-0.5 text-[9px] text-white/25">
                            Booked
                          </span>
                        )}
                      </button>
                    ))}
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

            {/* ── STEP 2: Client details ── */}
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
                  placeholder="Describe your vision, mood references, wardrobe ideas, or any specific requirements…"
                  value={form.notes}
                  onChange={(v) => setField("notes", v)}
                />
              </div>
            )}

            {/* ── STEP 3: Review ── */}
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

            {/* ── Navigation buttons ── */}
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
                  onClick={handleSubmit}
                  className="flex items-center gap-2.5 rounded-full bg-accent-red px-8 py-3 text-sm font-bold text-white shadow-lg shadow-accent-red/25 transition-all duration-300 hover:bg-accent-red/90 hover:shadow-accent-red/40"
                >
                  Confirm Booking
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

          {/* ── Right: Summary sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/3">
                {/* Sidebar header */}
                <div className="border-b border-white/6 px-6 py-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                    Booking Summary
                  </p>
                </div>

                <div className="px-6 py-5 space-y-5">
                  {/* Session type */}
                  {selectedSession ? (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-red/12 text-accent-red">
                        {selectedSession.icon}
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

                  {/* Date/Time row */}
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

                  {/* Client name */}
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

                  {/* Divider */}
                  <div className="border-t border-white/6" />

                  {/* Price breakdown */}
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

                  {/* Trust badges */}
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

              {/* Help link */}
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

      {/* ── Mobile summary bar ── */}
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
