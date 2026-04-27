// features/admin/testimonials/components/testimonial-card.tsx
"use client";

import { SelectTestimonial } from "@/lib/db/schema/testimonials";

interface Props {
  testimonial: SelectTestimonial;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: (val: boolean) => void;
}

export function TestimonialCard({
  testimonial,
  onEdit,
  onDelete,
  onTogglePublish,
}: Props) {
  const { clientName, clientTitle, quote, rating, isPublished, dateLabel } =
    testimonial;

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/60">
            {clientName
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{clientName}</p>
            <p className="text-xs text-white/35">
              {clientTitle || "—"} {dateLabel ? `· ${dateLabel}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
              isPublished
                ? "bg-green-500/10 text-green-400"
                : "bg-white/8 text-white/30"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </span>
          <span className="text-sm text-amber-400">
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </span>
        </div>
      </div>

      {/* Quote */}
      <p className="text-sm leading-relaxed text-white/50 italic">
        &quot;{quote}&quot;
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="rounded-full border border-white/12 px-4 py-1.5 text-xs font-medium text-white/50 hover:border-white/25 hover:text-white transition-all"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded-full border border-red-500/20 px-4 py-1.5 text-xs font-medium text-red-400/70 hover:border-red-500/40 hover:text-red-400 transition-all"
          >
            Delete
          </button>
        </div>
        <button
          onClick={() => onTogglePublish(!isPublished)}
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          {isPublished ? "Unpublish" : "Publish"}
        </button>
      </div>
    </div>
  );
}
