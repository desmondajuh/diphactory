"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);
gsap.config({ force3D: true });

type ImageItem = {
  src: string;
  alt?: string;
};

const images: ImageItem[] = [
  { src: "/images/gallery/1.jpg" },
  { src: "/images/gallery/3.jpg" },
  { src: "/images/gallery/2.jpg" },
  { src: "/images/gallery/6.jpg" },
  { src: "/images/gallery/4.jpg" },
  { src: "/images/gallery/5.jpg" },
  { src: "/images/gallery/7.jpg" },
  { src: "/images/gallery/2.jpg" },
  { src: "/images/gallery/8.jpg" },
  { src: "/images/gallery/9.jpg" },
  { src: "/images/gallery/5.jpg" },
  { src: "/images/gallery/7.jpg" },
  { src: "/images/gallery/1.jpg" },
  { src: "/images/gallery/3.jpg" },
  { src: "/images/gallery/8.jpg" },
  { src: "/images/gallery/6.jpg" },
  { src: "/images/gallery/4.jpg" },
  { src: "/images/gallery/9.jpg" },
];

export const MasonryGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ImageItem | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const images = container.querySelectorAll("img");
    // const items = gsap.utils.toArray<HTMLElement>(".parallax-item");

    const triggers: ScrollTrigger[] = [];

    // =============================
    // 🔹 REVEAL ANIMATION
    // =============================
    images.forEach((img) => {
      const anim = gsap.fromTo(
        img,
        {
          opacity: 0,
          //   rotateX: 45,
          y: 40,
          scale: 0.95,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          //   rotateX: 0,
          y: 0,
          scale: 1.1,
          ease: "power2.out",
          filter: "blur(0px)",
          duration: 0.8,
          scrollTrigger: {
            trigger: img,
            start: "top 95%",
            end: "top 30%",
            toggleActions: "play none play none",
            // markers: false,
            scrub: 0.4,
          },
        },
      );

      if (anim.scrollTrigger) {
        triggers.push(anim.scrollTrigger);
      }
    });

    // =============================
    // 🔹 PARALLAX ANIMATION
    // =============================
    // items.forEach((item) => {
    //   const img = item.querySelector("img");
    //   if (!img) return;

    //   const anim = gsap.to(img, {
    //     yPercent: 20,
    //     ease: "none",
    //     scrollTrigger: {
    //       trigger: item,
    //       start: "top bottom",
    //       end: "bottom top",
    //       scrub: true,
    //     },
    //   });
    //   if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    // });

    // Cleanup on unmount
    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="perspective-distant">
        <div className="masonry-layout p-5.5 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {images.map((img, i) => (
            <TiltCard key={i} onClick={() => setActive(img)}>
              <motion.div
                layoutId={`image-${i + 1}`}
                className="parallax-item mb-4 isolate break-inside-avoid rounded-xl  will-change-transform overflow-hidden"
              >
                <Image
                  src={img.src}
                  alt={`Gallery image ${i + 1}`}
                  width={600}
                  height={400}
                  className="object-cover w-full h-auto will-change-transform translate-z-0 rounded-xl scale-110"
                />
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>

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
