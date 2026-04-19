"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type ImageItem = {
  src: string;
  alt?: string;
};

const images: ImageItem[] = [
  { src: "/images/gallery/1.jpg" },
  { src: "/images/gallery/2.jpg" },
  { src: "/images/gallery/5.jpg" },
  { src: "/images/gallery/4.jpg" },
  { src: "/images/gallery/6.jpg" },
  { src: "/images/gallery/9.jpg" },
  { src: "/images/gallery/3.jpg" },
  { src: "/images/gallery/5.jpg" },
  { src: "/images/gallery/3.jpg" },
  { src: "/images/gallery/7.jpg" },
  { src: "/images/gallery/6.jpg" },
  { src: "/images/gallery/4.jpg" },
  { src: "/images/gallery/8.jpg" },
  { src: "/images/gallery/7.jpg" },
];

export const MasonryGallery2 = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<ImageItem | null>(null);

  // 🔥 SCROLL PARALLAX (GPU optimized)
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".parallax-item");

      items.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 80 },
          {
            y: -80,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className="w-full perspective-[1200px]">
        <div
          ref={containerRef}
          className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-6"
        >
          {images.map((img, i) => (
            <TiltCard key={i} onClick={() => setActive(img)}>
              <motion.div
                layoutId={`image-${img.src}`}
                className="parallax-item"
              >
                <Image
                  src={img.src}
                  alt={img.alt || ""}
                  width={600}
                  height={800}
                  className="w-full h-auto rounded-xl object-cover will-change-transform"
                />
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* 🔥 LIGHTBOX */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setActive(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div layoutId={`image-${active.src}`}>
              <Image
                src={active.src}
                alt=""
                width={1200}
                height={1600}
                className="rounded-2xl max-h-[90vh] w-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// =============================
// 🧠 3D TILT COMPONENT
// =============================

const TiltCard = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * -12;
    const rotateY = (x / rect.width - 0.5) * 12;

    gsap.to(el, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      transformOrigin: "center",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className="mb-4 break-inside-avoid cursor-pointer will-change-transform"
    >
      {children}
    </div>
  );
};
