// features/gallery/components/gallery-edit-modal.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/orpc";
import { GALLERY_IMAGE_TYPE } from "@/lib/db/schema";
import { AlbumOption } from "@/types/router-types";

interface Props {
  albums: AlbumOption[];
  image: GALLERY_IMAGE_TYPE;
  onClose: () => void;
  onSaved: () => void;
}

export function GalleryEditModal({ image, onClose, onSaved, albums }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: image.title ?? "",
    description: image.description ?? "",
    category: image.category ?? "",
    albumId: image.albumId ?? "",
  });

  const setField = <K extends keyof typeof form>(key: K, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await client.gallery.update({
        id: image.id,
        title: form.title || null,
        description: form.description || null,
        category: form.category || null,
        albumId: form.albumId || null,
      });
      toast.success("Image updated");
      onSaved();
    } catch {
      toast.error("Failed to update image");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0e0e] p-6 space-y-5">
        <p className="text-base font-semibold text-white">Edit image</p>

        {/* Album */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Album
          </label>
          <select
            value={form.albumId}
            onChange={(e) => setField("albumId", e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
          >
            <option value="">No album</option>
            {albums.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-white/30 truncate">{image.filename}</p>

        {[
          { label: "Title", key: "title" as const, placeholder: "Untitled" },
          {
            label: "Category",
            key: "category" as const,
            placeholder: "Wedding, Portrait…",
          },
        ].map(({ label, key, placeholder }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
              {label}
            </label>
            <input
              value={form[key]}
              onChange={(e) => setField(key, e.target.value)}
              placeholder={placeholder}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-white/20"
            />
          </div>
        ))}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Optional description…"
            rows={3}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-white/20 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="rounded-full border border-white/12 px-5 py-2 text-sm font-medium text-white/50 hover:text-white hover:border-white/25 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
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
