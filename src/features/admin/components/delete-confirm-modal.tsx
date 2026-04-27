// features/admin/testimonials/components/delete-confirm-modal.tsx
"use client";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0e0e0e] p-6 space-y-4">
        <div>
          <p className="text-base font-semibold text-white">
            Delete testimonial?
          </p>
          <p className="mt-1 text-sm text-white/40">
            This will permanently remove the testimonial. This cannot be undone.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 pt-1">
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
