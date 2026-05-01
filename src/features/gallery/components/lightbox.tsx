// features/gallery/components/lightbox.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import NextImage from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Download,
  Heart,
  LayoutGrid,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LightboxImage {
  id: string;
  utUrl: string;
  filename: string;
  title?: string | null;
  description?: string | null;
  width?: number | null;
  height?: number | null;
  blurDataUrl?: string | null;
}

export interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;

  // Feature flags
  enableSlideshow?: boolean;
  enableThumbnails?: boolean;
  enableDownload?: boolean;
  enableFavorites?: boolean;
  enableZoom?: boolean;

  // Slideshow config
  slideshowInterval?: number; // ms, default 4000

  // Favorites
  favorites?: Set<string>;
  onToggleFavorite?: (id: string) => void;

  // Download
  onDownload?: (image: LightboxImage) => void;
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

export function Lightbox({
  images,
  initialIndex = 0,
  onClose,
  enableSlideshow = true,
  enableThumbnails = true,
  enableDownload = true,
  enableFavorites = true,
  enableZoom = true,
  slideshowInterval = 4000,
  favorites = new Set(),
  onToggleFavorite,
  onDownload,
}: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const isMultiple = images.length > 1;
  const image = images[index];

  // ── Navigation ──
  const goTo = useCallback(
    (next: number, dir: "left" | "right") => {
      if (isAnimating || zoomed) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setIndex(next);
        setIsAnimating(false);
        setDirection(null);
      }, 220);
    },
    [isAnimating, zoomed],
  );

  const prev = useCallback(() => {
    if (index > 0) goTo(index - 1, "right");
  }, [index, goTo]);

  const next = useCallback(() => {
    if (index < images.length - 1) goTo(index + 1, "left");
  }, [index, images.length, goTo]);

  // ── Slideshow ──
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setIndex((prev) => {
        if (prev >= images.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, slideshowInterval);
    return () => clearInterval(timer);
  }, [isPlaying, images.length, slideshowInterval]);

  // ── Keyboard ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  // ── Scroll lock ──
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ── Download ──
  const handleDownload = async (img: LightboxImage) => {
    if (onDownload) {
      onDownload(img);
      return;
    }
    const res = await fetch(img.utUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = img.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 py-3 z-10 shrink-0">
        {/* Left: counter */}
        <div className="flex items-center gap-3">
          {isMultiple && (
            <span className="text-xs text-white/30 tabular-nums">
              {index + 1} / {images.length}
            </span>
          )}
          {(image.title || image.description) && (
            <div className="hidden sm:block">
              {image.title && (
                <p className="text-sm font-medium text-white/80 leading-none">
                  {image.title}
                </p>
              )}
              {image.description && (
                <p className="text-xs text-white/35 mt-0.5">
                  {image.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          {enableZoom && (
            <TopBarButton
              onClick={() => setZoomed((z) => !z)}
              active={zoomed}
              label={zoomed ? "Zoom out" : "Zoom in"}
            >
              {zoomed ? (
                <ZoomOut className="w-4 h-4" />
              ) : (
                <ZoomIn className="w-4 h-4" />
              )}
            </TopBarButton>
          )}
          {enableSlideshow && isMultiple && (
            <TopBarButton
              onClick={() => setIsPlaying((p) => !p)}
              active={isPlaying}
              label={isPlaying ? "Pause slideshow" : "Start slideshow"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </TopBarButton>
          )}
          {enableThumbnails && isMultiple && (
            <TopBarButton
              onClick={() => setShowThumbnails((t) => !t)}
              active={showThumbnails}
              label="Toggle thumbnails"
            >
              <LayoutGrid className="w-4 h-4" />
            </TopBarButton>
          )}
          {enableFavorites && onToggleFavorite && (
            <TopBarButton
              onClick={() => onToggleFavorite(image.id)}
              active={favorites.has(image.id)}
              label="Favorite"
              activeClass="text-red-400"
            >
              <Heart
                className="w-4 h-4"
                fill={favorites.has(image.id) ? "currentColor" : "none"}
              />
            </TopBarButton>
          )}
          {enableDownload && (
            <TopBarButton
              onClick={() => handleDownload(image)}
              label="Download"
            >
              <Download className="w-4 h-4" />
            </TopBarButton>
          )}
          <TopBarButton onClick={onClose} label="Close">
            <X className="w-4 h-4" />
          </TopBarButton>
        </div>
      </div>

      {/* ── Main image area ── */}
      <div className="relative flex-1 flex items-center justify-center min-h-0 overflow-hidden">
        {/* Prev button */}
        {isMultiple && index > 0 && (
          <NavButton direction="left" onClick={prev} disabled={isAnimating} />
        )}

        {/* Image */}
        <div
          className={cn(
            "relative max-w-full max-h-full transition-all duration-220",
            zoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in",
            isAnimating && direction === "left" && "animate-slide-left",
            isAnimating && direction === "right" && "animate-slide-right",
          )}
          onClick={() => enableZoom && setZoomed((z) => !z)}
          style={{
            maxHeight: showThumbnails
              ? "calc(100vh - 180px)"
              : "calc(100vh - 80px)",
          }}
        >
          <NextImage
            key={image.id}
            src={image.utUrl}
            alt={image.title ?? image.filename}
            width={image.width ?? 1200}
            height={image.height ?? 900}
            className="object-contain max-h-full w-auto select-none"
            style={{
              maxHeight: showThumbnails
                ? "calc(100vh - 180px)"
                : "calc(100vh - 80px)",
            }}
            placeholder={image.blurDataUrl ? "blur" : "empty"}
            blurDataURL={image.blurDataUrl ?? undefined}
            priority
            draggable={false}
          />
        </div>

        {/* Next button */}
        {isMultiple && index < images.length - 1 && (
          <NavButton direction="right" onClick={next} disabled={isAnimating} />
        )}

        {/* Slideshow progress bar */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
            <div
              key={`${index}-progress`}
              className="h-full bg-white/60"
              style={{
                animation: `progress ${slideshowInterval}ms linear`,
              }}
            />
          </div>
        )}
      </div>

      {/* ── Thumbnails strip ── */}
      {enableThumbnails && showThumbnails && isMultiple && (
        <div className="shrink-0 h-20 px-4 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => goTo(i, i > index ? "left" : "right")}
              className={cn(
                "relative shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-200 border-2",
                i === index
                  ? "border-white scale-105"
                  : "border-transparent opacity-50 hover:opacity-80",
              )}
            >
              <NextImage
                src={img.utUrl}
                alt={img.title ?? img.filename}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to { width: 100% }
        }
        .animate-slide-left {
          animation: slideLeft 220ms ease forwards;
        }
        .animate-slide-right {
          animation: slideRight 220ms ease forwards;
        }
        @keyframes slideLeft {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-40px); }
        }
        @keyframes slideRight {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(40px); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopBarButton({
  children,
  onClick,
  active,
  label,
  activeClass = "text-white",
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
  activeClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "rounded-lg p-2 transition-all duration-150",
        active
          ? `bg-white/15 ${activeClass}`
          : "text-white/40 hover:text-white hover:bg-white/10",
      )}
    >
      {children}
    </button>
  );
}

function NavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous image" : "Next image"}
      className={cn(
        "absolute z-10 flex items-center justify-center",
        "w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10",
        "text-white/50 hover:text-white hover:bg-black/70 hover:border-white/25",
        "transition-all duration-150 disabled:opacity-0",
        direction === "left" ? "left-4" : "right-4",
      )}
    >
      {direction === "left" ? (
        <ChevronLeft className="w-5 h-5" />
      ) : (
        <ChevronRight className="w-5 h-5" />
      )}
    </button>
  );
}
