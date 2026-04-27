// features/gallery/components/gallery-admin-grid.tsx
"use client";

import NextImage from "next/image";
import { GALLERY_IMAGE_TYPE } from "@/lib/db/schema/gallery";

interface Props {
  images: GALLERY_IMAGE_TYPE[];
  onEdit: (image: GALLERY_IMAGE_TYPE) => void;
  onDelete: (image: GALLERY_IMAGE_TYPE) => void;
}

export function GalleryAdminGrid({ images, onEdit, onDelete }: Props) {
  if (!images.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-white/20 text-sm">
          No images yet. Upload some above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative aspect-square overflow-hidden rounded-xl border border-white/8 bg-white/3"
        >
          <NextImage
            src={image.utUrl}
            alt={image.title ?? image.filename}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            placeholder={image.blurDataUrl ? "blur" : "empty"}
            blurDataURL={image.blurDataUrl ?? undefined}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300" />

          {/* Info + actions on hover */}
          <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => onEdit(image)}
                className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(image)}
                className="rounded-full bg-red-500/20 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/35 transition-all"
              >
                Delete
              </button>
            </div>
            <div>
              {image.title && (
                <p className="text-xs font-medium text-white truncate">
                  {image.title}
                </p>
              )}
              {image.category && (
                <p className="text-[10px] text-white/50 mt-0.5">
                  {image.category}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
