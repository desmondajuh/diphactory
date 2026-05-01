// features/admin/faq/views/faq-admin-view.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/orpc";
import { Faq } from "@/lib/db/schema";
import { FaqFormModal } from "../components/faq-form-modal";
import { FaqDeleteModal } from "../components/faq-delete-modal";

interface Props {
  initialFaqs: Faq[];
}

export function FaqAdminView({ initialFaqs }: Props) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [deleting, setDeleting] = useState<Faq | null>(null);

  const refresh = async () => {
    const data = await client.faq.listAll();
    setFaqs(data);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await client.faq.remove({ id: deleting.id });
      toast.success("FAQ deleted");
      setDeleting(null);
      await refresh();
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  const handleToggle = async (faq: Faq) => {
    try {
      await client.faq.update({ id: faq.id, isActive: !faq.isActive });
      await refresh();
    } catch {
      toast.error("Failed to update FAQ");
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const reordered = [...faqs];
    [reordered[index - 1], reordered[index]] = [
      reordered[index],
      reordered[index - 1],
    ];
    const updates = reordered.map((f, i) => ({ id: f.id, sortOrder: i }));
    try {
      await client.faq.reorder(updates);
      await refresh();
    } catch {
      toast.error("Failed to reorder");
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === faqs.length - 1) return;
    const reordered = [...faqs];
    [reordered[index], reordered[index + 1]] = [
      reordered[index + 1],
      reordered[index],
    ];
    const updates = reordered.map((f, i) => ({ id: f.id, sortOrder: i }));
    try {
      await client.faq.reorder(updates);
      await refresh();
    } catch {
      toast.error("Failed to reorder");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">FAQ</h1>
          <p className="text-sm text-white/35 mt-1">{faqs.length} questions</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="rounded-full bg-white text-[#0e0e0e] px-6 py-2.5 text-sm font-bold hover:bg-white/90 transition-all"
        >
          + Add question
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      faq.isActive
                        ? "bg-green-500/10 text-green-400"
                        : "bg-white/8 text-white/30"
                    }`}
                  >
                    {faq.isActive ? "Visible" : "Hidden"}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white truncate">
                  {faq.question}
                </p>
                <p className="text-xs text-white/35 mt-1 line-clamp-2 leading-relaxed">
                  {faq.answer}
                </p>
              </div>

              {/* Reorder buttons */}
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="rounded-lg p-1.5 text-white/25 hover:text-white hover:bg-white/8 disabled:opacity-20 transition-all"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === faqs.length - 1}
                  className="rounded-lg p-1.5 text-white/25 hover:text-white hover:bg-white/8 disabled:opacity-20 transition-all"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1 border-t border-white/6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(faq)}
                  className="rounded-full border border-white/12 px-4 py-1.5 text-xs font-medium text-white/50 hover:text-white hover:border-white/25 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleting(faq)}
                  className="rounded-full border border-red-500/20 px-4 py-1.5 text-xs font-medium text-red-400/70 hover:border-red-500/40 hover:text-red-400 transition-all"
                >
                  Delete
                </button>
              </div>
              <button
                onClick={() => handleToggle(faq)}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                {faq.isActive ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <FaqFormModal
          faq={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={async () => {
            setCreating(false);
            setEditing(null);
            await refresh();
          }}
        />
      )}

      {deleting && (
        <FaqDeleteModal
          faq={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
