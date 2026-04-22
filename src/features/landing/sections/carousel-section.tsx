"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { CarouselTitle } from "@/features/landing/components/carousel-title";

interface ImageCard {
  src: string;
  alt: string;
  skewY: number;
  scale: number;
  translateY: number;
  rotateY: number;
  translateX?: number;
  width: string | number;
  height?: number;
  heightOffset: number;
  negativeMargin?: number;
  mxValue?: string;
  clipLeft?: boolean;
  clipRight?: boolean;
  zIndex?: number;
}

const FAN_CARDS: ImageCard[] = [
  {
    src: "/images/gallery/1.jpg",
    alt: "Portrait – man in coat 1",
    mxValue: "mx-6",
    rotateY: 77.5,
    skewY: 7.5,
    scale: 2,
    translateY: -10,
    zIndex: 1,
    width: "105px",
    height: 220,
    heightOffset: 5,
    clipLeft: true,
  },
  {
    src: "/images/gallery/2.jpg",
    alt: "Product – perfume bottle on dark silk 2",
    mxValue: "mx-4",
    rotateY: 57.5,
    skewY: 5,
    scale: 1.55,
    translateY: 0,
    zIndex: 97.5,
    width: "115px",
    height: 220,
    heightOffset: 4,
  },
  {
    src: "/images/gallery/3.jpg",
    alt: "Automotive – car front close-up 3",
    mxValue: "mx-3",
    rotateY: 37.5,
    skewY: 3,
    scale: 1.3,
    translateY: 5,
    zIndex: 3,
    width: "125px",
    height: 220,
    heightOffset: 3,
  },
  {
    src: "/images/gallery/4.jpg",
    alt: "Beauty – woman with hands on face 4",
    mxValue: "mx-2",
    rotateY: 20.5,
    skewY: 1.5,
    scale: 1.1,
    translateY: 5,
    zIndex: 4,
    width: "135px",
    height: 220,
    heightOffset: 2,
  },
  {
    src: "/images/gallery/5.jpg",
    alt: "Beauty – woman center image 5",
    mxValue: "mx-2",
    rotateY: 0,
    skewY: 0,
    scale: 1,
    translateY: 5,
    zIndex: 98.5,
    width: "125px",
    height: 220,
    heightOffset: 1.5,
  },
  {
    src: "/images/gallery/6.jpg",
    alt: "Product – wine bottle on dark draped silk 6",
    mxValue: "mx-2",
    rotateY: -20.5,
    skewY: -1.5,
    scale: 1.1,
    translateY: 5,
    zIndex: 4,
    width: "135px",
    height: 220,
    heightOffset: 2,
  },
  {
    src: "/images/gallery/7.jpg",
    alt: "Automotive – car front close-up 7",
    mxValue: "mx-3",
    rotateY: -37.5,
    skewY: -3,
    scale: 1.3,
    translateY: 5,
    zIndex: 3,
    width: "125px",
    height: 220,
    heightOffset: 3,
  },
  {
    src: "/images/gallery/8.jpg",
    alt: "Automotive – car front close-up 8",
    mxValue: "mx-4",
    rotateY: -57.5,
    skewY: -5,
    scale: 1.55,
    translateY: 0,
    zIndex: 3,
    width: "115px",
    height: 220,
    heightOffset: 4,
  },
  {
    src: "/images/gallery/9.jpg",
    alt: "Automotive – car front close-up 9",
    mxValue: "mx-6",
    rotateY: -77.5,
    skewY: -7.5,
    scale: 2,
    translateY: -10,
    zIndex: 3,
    width: "105px",
    height: 220,
    heightOffset: 5,
  },
];

const CENTER_INDEX = 4;

/**
 * Enhancement 6: Shadow depth — deepest at center, fades toward edges.
 * distance 0 (center) → strongest shadow
 * distance 4 (far edge) → lightest shadow
 */
function getShadow(distFromCenter: number, isActive: boolean): string {
  if (isActive) {
    return "0 32px 64px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)";
  }
  const shadows = [
    "0 28px 56px rgba(0,0,0,0.45), 0 6px 20px rgba(0,0,0,0.28)", // center (dist 0)
    "0 20px 42px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.22)", // dist 1
    "0 14px 30px rgba(0,0,0,0.26), 0 3px 10px rgba(0,0,0,0.16)", // dist 2
    "0 8px 20px rgba(0,0,0,0.18), 0 2px 7px rgba(0,0,0,0.11)", // dist 3
    "0 4px 12px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)", // dist 4 (edges)
  ];
  return shadows[Math.min(distFromCenter, 4)];
}

export const CarouselSection = () => {
  // Enhancement 1: Scroll-triggered entrance
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Enhancement 2: Active card state
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleCardClick = (i: number) => {
    setActiveIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 min-h-screen"
    >
      <CarouselTitle />
      <div className="mt-16 flex justify-center items-end gap-3 perspective-distant">
        {FAN_CARDS.map((card, i) => {
          const distFromCenter = Math.abs(i - CENTER_INDEX);
          const isActive = activeIndex === i;
          const hasActive = activeIndex !== null;

          // Enhancement 2: dim non-active cards when one is selected
          const opacityValue = hasActive && !isActive ? 0.45 : 1;

          // Enhancement 6: per-card shadow depth
          const boxShadow = getShadow(distFromCenter, isActive);

          // Enhancement 1: stagger delay — cascade from outside in
          const staggerDelay = distFromCenter * 0.07;

          // Enhancement 2: active card gets a slight extra lift on top of existing transform
          const activeBoost = isActive ? " scale(1.06) translateY(-8px)" : "";

          const mirrorHeight: number = card.heightOffset * 0.2 * 200;
          const mirrorOffset: string = `${mirrorHeight + 200}px`;

          return (
            <motion.div
              key={i}
              // Enhancement 1: entrance animation
              initial={{ opacity: 0, y: 60 }}
              animate={
                isInView
                  ? { opacity: opacityValue, y: 0 }
                  : { opacity: 0, y: 60 }
              }
              transition={{
                duration: 0.65,
                delay: staggerDelay,
                ease: [0.22, 1, 0.36, 1],
              }}
              // Enhancement 2: smooth opacity transition when active state changes
              style={{
                width: card.width,
                zIndex: isActive ? 999 : card.zIndex,
                transformStyle: "preserve-3d",
                cursor: "pointer",
                // Enhancement 6: shadow depth
                filter: `drop-shadow(${boxShadow.split(",")[0].replace("0 ", "0px ")})`,
              }}
              className={cn("relative rounded-2xl", card.mxValue)}
              onClick={() => handleCardClick(i)}
            >
              {/* ── Main card ── */}
              <div
                className="relative rounded-2xl overflow-hidden transition-all duration-500"
                style={{
                  width: "100%",
                  height: `${card.height ?? 280}px`,
                  transform: `
                    perspective(1200px)
                    rotateY(${card.rotateY}deg)
                    skewY(${card.skewY}deg)
                    scale(${card.scale})
                    translateY(${card.translateY}px)
                    ${activeBoost}
                  `,
                  boxShadow,
                  transition:
                    "box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease",
                }}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover hover:scale-105 transition-transform duration-200"
                />

                {/* Enhancement 2: Active card — subtle highlight ring */}
                {isActive && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.55)",
                      zIndex: 3,
                    }}
                  />
                )}
              </div>

              {/* Enhancement 5: Card reflection */}
              <div
                className="pointer-events-none absolute left-0 right-0 opacity-20"
                aria-hidden="true"
                style={{
                  // Sit just below the card, accounting for the transform translateY
                  // top: `${200 * (0.2 * card.heightOffset) + 300}px`,
                  top: mirrorOffset,
                  // height: `80px`,
                  // top: `${(card.height ?? 480)}px`,
                  height: `${Math.round((card.height ?? 180) * 0.38)}px`,
                  transform: `
                    perspective(1200px)
                    rotateY(${card.rotateY}deg)
                    skewY(${card.skewY * 0.3}deg)
                    scale(${card.scale})
                    translateY(${card.heightOffset * 4}px)
                    scaleY(-1)
                  `,
                  // transformOrigin: "top center",
                  overflow: "hidden",
                  borderRadius: "0 0 16px 16px",
                }}
              >
                {/* Reflected image */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Image
                    src={card.src}
                    alt=""
                    fill
                    className="object-cover object-top"
                    aria-hidden="true"
                  />
                  {/* Gradient mask to fade the reflection out */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.70) 50%, rgba(255,255,255,1) 100%)",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
