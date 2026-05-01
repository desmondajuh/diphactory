// features/admin/faq/components/faq-form-modal.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/orpc";
import { Faq } from "@/lib/db/schema";

interface Props {
  faq: Faq | null;
  onClose: () => void;
  onSaved: () => void;
}

export function FaqFormModal({ faq, onClose, onSaved }: Props) {
  const isEditing = !!faq;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    question: faq?.question ?? "",
    answer: faq?.answer ?? "",
    isActive: faq?.isActive ?? true,
  });

  const setField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question and answer are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await client.faq.update({ id: faq.id, ...form });
        toast.success("FAQ updated");
      } else {
        await client.faq.create({ ...form, sortOrder: 999 });
        toast.success("FAQ created");
      }
      onSaved();
    } catch {
      toast.error("Failed to save FAQ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e0e0e] p-6 space-y-5">
        <p className="text-base font-semibold text-white">
          {isEditing ? "Edit question" : "New question"}
        </p>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Question
          </label>
          <input
            value={form.question}
            onChange={(e) => setField("question", e.target.value)}
            placeholder="What does a project look like?"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-white/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Answer
          </label>
          <textarea
            value={form.answer}
            onChange={(e) => setField("answer", e.target.value)}
            placeholder="Every project starts with..."
            rows={5}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-white/20 resize-none leading-relaxed"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setField("isActive", e.target.checked)}
            className="h-4 w-4 accent-red-500"
          />
          <span className="text-sm text-white/50">Visible on site</span>
        </label>

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
