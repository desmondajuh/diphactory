// components/contact/ContactPage.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Calendar, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { PageHeroTwo } from "@/components/shared/heros/page-hero-two";
import { SubmitButton } from "../components/submit-btn";
import { Field } from "../components/fields";
import { Sidebar } from "../components/sidebar";

type Tab = "contact" | "booking";

const SESSION_TYPES = [
  "Portrait",
  "Wedding",
  "Brand / Commercial",
  "Editorial",
  "Event",
  "Other",
];

export const Contact2 = () => {
  const [tab, setTab] = useState<Tab>("contact");
  const [selectedService, setSelectedService] = useState("Portrait");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── HERO ── */}
      <PageHeroTwo
        label="CONTACT US"
        badge="Available for bookings"
        subTitle="Every great image starts with a conversation. Tell me about your
          vision and let's make it real."
      />

      {/* ── BODY ── */}
      <div className="grid md:grid-cols-[1fr_1.6fr]">
        {/* Sidebar */}
        <Sidebar />

        {/* Form area */}
        <main className="p-6 md:p-10">
          {/* Tabs */}
          <div className="mb-8 flex overflow-hidden rounded-xl border border-border bg-muted">
            {(["contact", "booking"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative flex-1 py-3 text-sm font-medium transition-colors
                  ${tab === t ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab === t && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-accent-red"
                    style={{ borderRadius: "inherit" }}
                  />
                )}
                <span className="relative z-10">
                  {t === "contact" ? "Send a message" : "Book a session"}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "contact" ? (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <ContactForm />
              </motion.div>
            ) : (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <BookingForm
                  selectedService={selectedService}
                  onServiceSelect={setSelectedService}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ── FOOTER STRIP ── */}
    </div>
  );
};

const inputCls = `w-full rounded-lg border border-border bg-muted px-3.5 py-2.5 text-sm
  text-foreground outline-none placeholder:text-muted-foreground/50
  focus:border-accent-red focus:ring-2 focus:ring-accent-red/10 transition-shadow`;

// ── CONTACT FORM ─────────────────────────────────────────────

const ContactForm = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <Field label="First name">
        <input className={inputCls} placeholder="John" />
      </Field>
      <Field label="Last name">
        <input className={inputCls} placeholder="Doe" />
      </Field>
    </div>
    <Field label="Email address">
      <input
        type="email"
        className={inputCls}
        placeholder="johndoe@example.com"
      />
    </Field>
    <Field label="Subject">
      <input className={inputCls} placeholder="What's this about?" />
    </Field>
    <Field label="Message">
      <textarea
        className={`${inputCls} min-h-30 resize-y leading-relaxed`}
        placeholder="Tell me what you have in mind..."
      />
    </Field>
    <SubmitButton label="SEND MESSAGE" icon={<Send className="h-4 w-4" />} />
  </div>
);

// ── BOOKING FORM ─────────────────────────────────────────────

const BookingForm = ({
  selectedService,
  onServiceSelect,
}: {
  selectedService: string;
  onServiceSelect: (s: string) => void;
}) => (
  <div className="space-y-4">
    <div>
      <p className="mb-2.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Session type
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SESSION_TYPES.map((s) => (
          <button
            key={s}
            onClick={() => onServiceSelect(s)}
            className={`rounded-lg border py-2.5 text-sm transition-all
              ${
                selectedService === s
                  ? "border-accent-red bg-accent-red/8 text-accent-red"
                  : "border-border bg-muted text-muted-foreground hover:border-border/80"
              }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Full name">
        <input className={inputCls} placeholder="Your name" />
      </Field>
      <Field label="Email">
        <input
          type="email"
          className={inputCls}
          placeholder="you@example.com"
        />
      </Field>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Preferred date">
        <input type="date" className={inputCls} />
      </Field>
      <Field label="Budget range">
        <select className={inputCls}>
          <option value="">Select range</option>
          <option>Under ₦100,000</option>
          <option>₦100k – ₦300k</option>
          <option>₦300k – ₦500k</option>
          <option>₦500k+</option>
        </select>
      </Field>
    </div>
    <Field label="Location / Venue">
      <input
        className={inputCls}
        placeholder="Where will the shoot take place?"
      />
    </Field>
    <Field label="Additional details">
      <textarea
        className={`${inputCls} min-h-27.5 resize-y leading-relaxed`}
        placeholder="Vision, mood board, number of people, special requirements..."
      />
    </Field>
    <SubmitButton
      label="REQUEST BOOKING"
      icon={<Calendar className="h-4 w-4" />}
    />
  </div>
);
