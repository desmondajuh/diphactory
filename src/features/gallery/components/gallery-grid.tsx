// features/gallery/components/gallery-grid.tsx
"use client";

import { useState } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { GALLERY_IMAGE_TYPE } from "@/lib/db/schema";
import { Lightbox } from "./lightbox";

interface Props {
  images: GALLERY_IMAGE_TYPE[];
  categories: string[];
  albumSlugs: Record<string, string>; // albumId → slug
}

export function GalleryGrid({ images, categories, albumSlugs }: Props) {
  const [active, setActive] = useState("All");
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const router = useRouter();
  // const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    active === "All" ? images : images.filter((i) => i.category === active);

  const handleImageClick = (image: GALLERY_IMAGE_TYPE, idx: number) => {
    if (image.albumId && albumSlugs[image.albumId]) {
      // console.log(albumSlugs[image.albumId]);
      router.push(`/gallery/${albumSlugs[image.albumId]}`);
    } else {
      // setLightboxIndex(idx);
      setLightboxId(image.id);
    }
  };

  // build images without albums for lightbox
  // const noAlbumImages = filtered.filter(
  //   (i) => !i.albumId || !albumSlugs[i.albumId],
  // );
  const lightboxIndex = lightboxId
    ? filtered.findIndex((i) => i.id === lightboxId)
    : null;

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
        {filtered.map((image, idx) => (
          <div
            key={image.id}
            className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl cursor-pointer"
            onClick={() => handleImageClick(image, idx)}
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

            {/* Album indicator badge */}
            {image.albumId && albumSlugs[image.albumId] && (
              <div className="absolute top-3 left-3 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white/70 opacity-0 group-hover:opacity-100 transition-all duration-300">
                View album →
              </div>
            )}

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

      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          // images={noAlbumImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxId(null)}
          enableSlideshow
          enableThumbnails
          enableDownload
          enableZoom
        />
      )}
    </>
  );
}
