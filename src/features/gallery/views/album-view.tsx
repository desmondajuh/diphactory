// features/gallery/views/album-view.tsx
"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import {
  Download,
  Heart,
  Share2,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AlbumWithImages, AlbumImage } from "@/types/router-types";
import { Lightbox } from "../components/lightbox";

// type AlbumWithImages = Album & { albumImages: GALLERY_IMAGE_TYPE[] };

export function AlbumView({ album }: { album: AlbumWithImages }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<number | null>(null);

  const toggleFavorite = (id: string) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleDownload = async (image: AlbumImage) => {
    const res = await fetch(image.utUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = image.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  const allImages = album.albumImages.map((ai) => ai.image);
  const coverImage =
    allImages.find((i) => i.id === album.coverImageId) ?? allImages[0];

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      {/* Hero */}
      <div className="relative h-[70vh] overflow-hidden">
        {coverImage && (
          <NextImage
            src={coverImage.utUrl}
            alt={album.title}
            fill
            className="object-cover"
            priority
            placeholder={coverImage.blurDataUrl ? "blur" : "empty"}
            blurDataURL={coverImage.blurDataUrl ?? undefined}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#0e0e0e] via-black/30 to-transparent" />
        <div className="absolute bottom-10 left-8">
          <h1
            className="font-black text-white leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            {album.title}
          </h1>
          {album.shootDate && (
            <p className="text-white/50 text-sm uppercase tracking-[0.2em] mt-2">
              {new Date(album.shootDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div className="sticky top-0 z-30 border-b border-white/8 bg-[#0e0e0e]/90 backdrop-blur-md px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/gallery"
            className="text-xs text-white/30 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ChevronLeft className="w-3 h-3" /> All albums
          </Link>
          <div className="flex items-center gap-2">
            <p className="text-xs text-white/30 mr-2">
              {favorites.size > 0 && `${favorites.size} selected`}
            </p>
            <ActionButton
              icon={<Play className="w-4 h-4" />}
              label="Slideshow"
              onClick={() => setLightbox(1)}
            />
            <ActionButton
              icon={<Share2 className="w-4 h-4" />}
              label="Share"
              onClick={handleShare}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
          {allImages.map((image, idx) => (
            <div
              key={image.id}
              className="group relative mb-3 break-inside-avoid overflow-hidden rounded-xl cursor-pointer"
            >
              <NextImage
                src={image.utUrl}
                alt={image.filename}
                width={image.width ?? 600}
                height={image.height ?? 400}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                placeholder={image.blurDataUrl ? "blur" : "empty"}
                blurDataURL={image.blurDataUrl ?? undefined}
                onClick={() => setLightbox(idx)}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 pointer-events-none" />
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(image.id);
                  }}
                  className={cn(
                    "rounded-full p-2 backdrop-blur-sm transition-all",
                    favorites.has(image.id)
                      ? "bg-red-500 text-white"
                      : "bg-black/40 text-white/70 hover:text-white",
                  )}
                >
                  <Heart
                    className="w-3.5 h-3.5"
                    fill={favorites.has(image.id) ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image);
                  }}
                  className="rounded-full p-2 bg-black/40 backdrop-blur-sm text-white/70 hover:text-white transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox
          images={allImages}
          initialIndex={lightbox}
          onClose={() => setLightbox(null)}
          enableSlideshow
          enableThumbnails
          enableFavorites
          // onChange={setLightbox}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          slideshowInterval={4000}
          // onDownload={handleDownload}
        />
      )}
    </div>
  );
}

// ── Action button ──
function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/40 hover:text-white hover:border-white/25 transition-all"
    >
      {icon} {label}
    </button>
  );
}
