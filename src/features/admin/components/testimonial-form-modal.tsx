// features/admin/testimonials/components/testimonial-form-modal.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/orpc";
import { SelectTestimonial } from "@/lib/db/schema/testimonials";
import { InputField } from "@/features/bookings/components/input-field";
import { TextareaField } from "@/components/shared/forms/text-area-field";

interface Props {
  testimonial: SelectTestimonial | null;
  onClose: () => void;
  onSaved: () => void;
}

export function TestimonialFormModal({ testimonial, onClose, onSaved }: Props) {
  const isEditing = !!testimonial;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    clientName: testimonial?.clientName ?? "",
    clientTitle: testimonial?.clientTitle ?? "",
    clientImage: testimonial?.clientImage ?? "",
    quote: testimonial?.quote ?? "",
    rating: testimonial?.rating ?? 5,
    dateLabel: testimonial?.dateLabel ?? "",
    isPublished: testimonial?.isPublished ?? true,
    sortOrder: testimonial?.sortOrder ?? 0,
  });

  const setField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.clientName.trim() || !form.quote.trim()) {
      toast.error("Name and quote are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await client.testimonials.update({
          id: testimonial.id,
          ...form,
          clientTitle: form.clientTitle || null,
          clientImage: form.clientImage || null,
          dateLabel: form.dateLabel || null,
        });
        toast.success("Testimonial updated");
      } else {
        await client.testimonials.create({
          ...form,
          clientTitle: form.clientTitle || null,
          clientImage: form.clientImage || null,
          dateLabel: form.dateLabel || null,
        });
        toast.success("Testimonial created");
      }
      onSaved();
    } catch {
      toast.error("Failed to save testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e0e0e] p-6 space-y-5">
        <p className="text-base font-semibold text-white">
          {isEditing ? "Edit testimonial" : "New testimonial"}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Client Name"
            id="clientName"
            placeholder="Jane Doe"
            value={form.clientName}
            onChange={(v) => setField("clientName", v)}
            required
          />
          <InputField
            label="Title / Role"
            id="clientTitle"
            placeholder="Wedding client"
            value={form.clientTitle ?? ""}
            onChange={(v) => setField("clientTitle", v)}
          />
        </div>

        <TextareaField
          label="Quote"
          id="quote"
          placeholder="What did they say..."
          value={form.quote}
          onChange={(v) => setField("quote", v)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Rating
            </label>
            <select
              value={form.rating}
              onChange={(e) => setField("rating", Number(e.target.value))}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} stars
                </option>
              ))}
            </select>
          </div>
          <InputField
            label="Date Label"
            id="dateLabel"
            placeholder="March 2024"
            value={form.dateLabel ?? ""}
            onChange={(v) => setField("dateLabel", v)}
          />
        </div>

        <InputField
          label="Image URL"
          id="clientImage"
          placeholder="https://..."
          value={form.clientImage ?? ""}
          onChange={(v) => setField("clientImage", v)}
        />

        {/* Published toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setField("isPublished", e.target.checked)}
            className="h-4 w-4 accent-red-500"
          />
          <span className="text-sm text-white/50">Published</span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="rounded-full border border-white/12 px-5 py-2 text-sm font-medium text-white/50 hover:text-white hover:border-white/25 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-full bg-white px-6 py-2 text-sm font-bold text-[#0e0e0e] hover:bg-white/90 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
