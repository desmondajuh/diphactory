// features/admin/sections/components/section-delete-modal.tsx
"use client";

import { SectionWithItems } from "@/lib/db/schema";

interface Props {
  section: SectionWithItems;
  onCancel: () => void;
  onConfirm: () => void;
}

export function SectionDeleteModal({ section, onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0e0e0e] p-6 space-y-4">
        <div>
          <p className="text-base font-semibold text-white">Delete section?</p>
          <p className="mt-1 text-sm text-white/40">
            <span className="text-white/60">
              &quot;{section.sectionName}&quot;
            </span>{" "}
            and all its items will be permanently removed.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-full border border-white/12 px-5 py-2 text-sm font-medium text-white/50 hover:text-white hover:border-white/25 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-red-500 px-5 py-2 text-sm font-bold text-white hover:bg-red-500/80 transition-all"
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}
