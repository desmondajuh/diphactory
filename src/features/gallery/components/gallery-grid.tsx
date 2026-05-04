// features/gallery/components/gallery-grid.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { GALLERY_IMAGE_TYPE } from "@/lib/db/schema";
import { Lightbox } from "./lightbox";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

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

  const containerRef = useRef<HTMLDivElement>(null);

  const filtered =
    active === "All" ? images : images.filter((i) => i.category === active);

  const handleImageClick = (image: GALLERY_IMAGE_TYPE) => {
    if (image.albumId && albumSlugs[image.albumId]) {
      router.push(`/gallery/${albumSlugs[image.albumId]}`);
    } else {
      setLightboxId(image.id);
    }
  };

  const lightboxIndex = lightboxId
    ? filtered.findIndex((i) => i.id === lightboxId)
    : null;

  // GSAP scroll-reveal on every re-render (filter change or mount)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const imgs = container.querySelectorAll<HTMLElement>("img");
    const triggers: ScrollTrigger[] = [];

    imgs.forEach((img) => {
      const anim = gsap.fromTo(
        img,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1.1, // slightly zoomed in at rest — matches original
          filter: "blur(0px)",
          ease: "power2.out",
          duration: 0.8,
          scrollTrigger: {
            trigger: img,
            start: "top 95%",
            end: "top 30%",
            toggleActions: "play none play none",
            scrub: 0.4,
          },
        },
      );
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [active]); // re-run when filter changes

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
      <div
        ref={containerRef}
        className="columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-7xl mx-auto"
      >
        {filtered.map((image, idx) => (
          <TiltCard key={image.id} onClick={() => handleImageClick(image)}>
            <motion.div
              layoutId={`gallery-image-${image.id}`}
              className="mb-4 break-inside-avoid overflow-hidden rounded-xl isolate will-change-transform"
            >
              {/* Inner group handles hover overlay / badges */}
              <div
                // key={image.id}
                className="group relative"
                // onClick={() => handleImageClick(image, idx)}
              >
                <NextImage
                  src={image.utUrl}
                  alt={image.title ?? image.filename}
                  width={image.width ?? 800}
                  height={image.height ?? 600}
                  className="w-full object-cover transition-transform will-change-transform transform-gpu duration-700 scale-115 group-hover:scale-[1.15]"
                  placeholder={image.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={image.blurDataUrl ?? undefined}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

                {/* Album indicator badge */}
                {image.albumId && albumSlugs[image.albumId] && (
                  <div className="absolute top-3 left-3 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white/70 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    View album →
                  </div>
                )}

                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-sm font-medium text-white">
                      {image.title}
                    </p>
                    {image.category && (
                      <p className="text-xs text-white/50 mt-0.5">
                        {image.category}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </TiltCard>
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

// ─────────────────────────────────────────────
// 3D Tilt card (identical to MasonryGallery)
// ─────────────────────────────────────────────

function TiltCard({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(el, {
      rotateX: (y / rect.height - 0.5) * -12,
      rotateY: (x / rect.width - 0.5) * 12,
      transformPerspective: 800,
      transformOrigin: "center",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.out" });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className="cursor-pointer will-change-transform"
    >
      {children}
    </div>
  );
}
