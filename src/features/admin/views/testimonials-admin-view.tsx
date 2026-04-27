// features/admin/testimonials/views/testimonials-admin-view.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/orpc";
import { SelectTestimonial } from "@/lib/db/schema/testimonials";
import { TestimonialCard } from "../components/testimonial-card";
import { TestimonialFormModal } from "../components/testimonial-form-modal";
import { DeleteConfirmModal } from "../components/delete-confirm-modal";

interface Props {
  initialTestimonials: SelectTestimonial[];
}

export function TestimonialsAdminView({ initialTestimonials }: Props) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [editing, setEditing] = useState<SelectTestimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = async () => {
    const data = await client.testimonials.listAll();
    setTestimonials(data);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await client.testimonials.remove({ id: deletingId });
      toast.success("Testimonial deleted");
      setDeletingId(null);
      await refresh();
    } catch {
      toast.error("Failed to delete testimonial");
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      await client.testimonials.togglePublished({ id, isPublished });
      await refresh();
    } catch {
      toast.error("Failed to update testimonial");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-white/40">
          {testimonials.length} testimonials
        </p>
        <button
          onClick={() => setCreating(true)}
          className="rounded-full bg-white text-[#0e0e0e] px-5 py-2 text-sm font-bold"
        >
          + Add testimonial
        </button>
      </div>

      {testimonials.map((t) => (
        <TestimonialCard
          key={t.id}
          testimonial={t}
          onEdit={() => setEditing(t)}
          onDelete={() => setDeletingId(t.id)}
          onTogglePublish={(val) => handleTogglePublish(t.id, val)}
        />
      ))}

      {(creating || editing) && (
        <TestimonialFormModal
          testimonial={editing}
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

      {deletingId && (
        <DeleteConfirmModal
          onCancel={() => setDeletingId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
