// features/gallery/components/gallery-grid.tsx
"use client";

import { useState } from "react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { GALLERY_IMAGE_TYPE } from "@/lib/db/schema";

interface Props {
  images: GALLERY_IMAGE_TYPE[];
  categories: string[];
}

export function GalleryGrid({ images, categories }: Props) {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<GALLERY_IMAGE_TYPE | null>(null);

  const filtered =
    active === "All" ? images : images.filter((i) => i.category === active);

  return (
    <>
      {/* Category filter */}
      {categories.length > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-200",
                active === cat
                  ? "bg-white text-[#0e0e0e]"
                  : "border border-white/10 text-white/40 hover:border-white/25 hover:text-white",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-7xl mx-auto">
        {filtered.map((image) => (
          <div
            key={image.id}
            className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl cursor-pointer"
            onClick={() => setLightbox(image)}
          >
            <NextImage
              src={image.utUrl}
              alt={image.title ?? image.filename}
              width={image.width ?? 800}
              height={image.height ?? 600}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              placeholder={image.blurDataUrl ? "blur" : "empty"}
              blurDataURL={image.blurDataUrl ?? undefined}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-sm font-medium text-white">{image.title}</p>
                {image.category && (
                  <p className="text-xs text-white/50 mt-0.5">
                    {image.category}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors text-sm"
          >
            ✕ Close
          </button>
          <div
            className="relative max-w-5xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <NextImage
              src={lightbox.utUrl}
              alt={lightbox.title ?? lightbox.filename}
              width={lightbox.width ?? 1200}
              height={lightbox.height ?? 900}
              className="rounded-xl object-contain max-h-[85vh] w-full"
              placeholder={lightbox.blurDataUrl ? "blur" : "empty"}
              blurDataURL={lightbox.blurDataUrl ?? undefined}
            />
            {(lightbox.title || lightbox.description) && (
              <div className="mt-3 text-center">
                {lightbox.title && (
                  <p className="text-sm font-medium text-white">
                    {lightbox.title}
                  </p>
                )}
                {lightbox.description && (
                  <p className="text-xs text-white/40 mt-1">
                    {lightbox.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
