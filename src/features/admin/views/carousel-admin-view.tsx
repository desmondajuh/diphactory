// features/admin/carousel/views/carousel-admin-view.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import NextImage from "next/image";
import { client } from "@/lib/orpc";
import { CarouselImage } from "@/lib/db/schema";
import { useUploadThing } from "@/lib/uploadthing-client";
import { cn } from "@/lib/utils";

// Static config labels for the 9 slots
const SLOT_LABELS = [
  "Slot 1 — Far left (most angled)",
  "Slot 2 — Left outer",
  "Slot 3 — Left inner",
  "Slot 4 — Left center",
  "Slot 5 — Center (hero)",
  "Slot 6 — Right center",
  "Slot 7 — Right inner",
  "Slot 8 — Right outer",
  "Slot 9 — Far right (most angled)",
];

interface Props {
  initialImages: CarouselImage[];
}

export function CarouselAdminView({ initialImages }: Props) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState<number | null>(null); // slot index
  const [editingAlt, setEditingAlt] = useState<string | null>(null);
  const [altValues, setAltValues] = useState<Record<string, string>>(
    Object.fromEntries(initialImages.map((img) => [img.id, img.alt])),
  );

  const { startUpload } = useUploadThing("galleryUploader");

  const refresh = async () => {
    const data = await client.carousel.listAll();
    setImages(data);
    setAltValues(Object.fromEntries(data.map((img) => [img.id, img.alt])));
  };

  const handleUpload = async (slotIndex: number, file: File) => {
    setUploading(slotIndex);
    try {
      const results = await startUpload([file]);
      if (!results?.[0]) throw new Error("Upload failed");

      const existing = images.find((img) => img.sortOrder === slotIndex);

      await client.carousel.upsertSlot({
        id: existing?.id,
        src: results[0].ufsUrl,
        alt: existing?.alt ?? SLOT_LABELS[slotIndex],
        utKey: results[0].key,
        sortOrder: slotIndex,
        isActive: true,
      });

      toast.success(`Slot ${slotIndex + 1} updated`);
      await refresh();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleSaveAlt = async (image: CarouselImage) => {
    try {
      await client.carousel.upsertSlot({
        id: image.id,
        src: image.src,
        alt: altValues[image.id] ?? image.alt,
        utKey: image.utKey,
        sortOrder: image.sortOrder,
        isActive: image.isActive,
      });
      toast.success("Alt text saved");
      setEditingAlt(null);
      await refresh();
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleToggle = async (image: CarouselImage) => {
    try {
      await client.carousel.toggleActive({
        id: image.id,
        isActive: !image.isActive,
      });
      await refresh();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleRemove = async (image: CarouselImage) => {
    try {
      await client.carousel.remove({ id: image.id, utKey: image.utKey });
      toast.success("Image removed from slot");
      await refresh();
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Carousel Images</h1>
        <p className="text-sm text-white/35 mt-1">
          Manage the 9 image slots for the homepage fan carousel. Styling and
          positioning are fixed — only images change.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SLOT_LABELS.map((label, slotIndex) => {
          const image = images.find((img) => img.sortOrder === slotIndex);
          const isUploading = uploading === slotIndex;

          return (
            <div
              key={slotIndex}
              className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden"
            >
              {/* Slot image preview */}
              <div className="relative aspect-[3/4] bg-white/5">
                {image ? (
                  <>
                    <NextImage
                      src={image.src}
                      alt={image.alt}
                      fill
                      className={cn(
                        "object-cover transition-opacity duration-300",
                        !image.isActive && "opacity-30",
                      )}
                    />
                    {!image.isActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="rounded-full bg-black/60 px-3 py-1 text-xs text-white/50">
                          Hidden
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(slotIndex, file);
                      }}
                    />
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="text-white/20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-xs text-white/25">Upload image</span>
                  </label>
                )}

                {/* Upload overlay for existing slots */}
                {image && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 transition-all cursor-pointer opacity-0 hover:opacity-100">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(slotIndex, file);
                      }}
                    />
                    <span className="text-xs font-medium text-white">
                      {isUploading ? "Uploading..." : "Replace image"}
                    </span>
                  </label>
                )}

                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <span className="text-xs text-white/60 animate-pulse">
                      Uploading...
                    </span>
                  </div>
                )}
              </div>

              {/* Slot info */}
              <div className="p-4 space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">
                  {label}
                </p>

                {/* Alt text */}
                {image && (
                  <div>
                    {editingAlt === image.id ? (
                      <div className="flex gap-2">
                        <input
                          value={altValues[image.id] ?? ""}
                          onChange={(e) =>
                            setAltValues((prev) => ({
                              ...prev,
                              [image.id]: e.target.value,
                            }))
                          }
                          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white outline-none focus:border-white/25"
                          placeholder="Alt text..."
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveAlt(image)}
                          className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-[#0e0e0e]"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingAlt(image.id)}
                        className="text-xs text-white/30 hover:text-white/60 transition-colors truncate w-full text-left"
                      >
                        {image.alt || "Add alt text…"}
                      </button>
                    )}
                  </div>
                )}

                {/* Actions */}
                {image && (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleToggle(image)}
                      className="text-xs text-white/30 hover:text-white/60 transition-colors"
                    >
                      {image.isActive ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => handleRemove(image)}
                      className="text-xs text-red-400/50 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
