"use client";

import Image from "next/image";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";

interface ParallaxStickySectionProps {
  /** Full-bleed background image for section 1 */
  imageSrc: string;
  imageAlt?: string;
  /** Content rendered inside the sticky section 1 */
  children?: React.ReactNode;
  /** Content rendered inside the overlapping section 2 */
  overlayContent?: React.ReactNode;
}

export function ParallaxStickySection({
  imageSrc,
  imageAlt = "Background",
  children,
  overlayContent,
}: ParallaxStickySectionProps) {
  /**
   * The wrapper is 200vh tall — 100vh for Section 1 to sit in view,
   * then another 100vh of scroll distance that drives the parallax.
   * Section 2 is at least 100vh so it has content to scroll through.
   */
  const wrapperRef = useRef<HTMLDivElement>(null);

  /**
   * Track scroll progress through the wrapper.
   * offset: ["start start", "end end"] means:
   *   0 = wrapper top hits viewport top
   *   1 = wrapper bottom hits viewport bottom
   *
   * The zoom+dim effect should start only once Section 2 begins
   * overlapping (i.e. after the first 100vh of scroll is done).
   * We use offset ["end start", "end end"] on the sticky section
   * itself to isolate just that second half of travel.
   */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  /**
   * Map the second half of scroll (0.4 → 1.0) to our effects.
   * Before 0.4 → no effect. After 0.4 → progressively zoomed + dimmed.
   * Using 0.4 not 0.5 gives a slight anticipation before Section 2 arrives.
   */
  const imageScale = useTransform(scrollYProgress, [0.35, 1], [1, 1.18]);
  const overlayOpacity = useTransform(scrollYProgress, [0.35, 0.92], [0, 0.78]);

  return (
    /**
     * Outer wrapper — tall enough to provide scroll travel.
     * Section 2 sits inside here so its scroll distance is measured correctly.
     */
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {/* ── SECTION 1: Sticky fullscreen ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {/* Zooming background image */}
        <motion.div
          style={{
            scale: imageScale,
            position: "absolute",
            inset: 0,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Dimming overlay — grows as Section 2 scrolls in */}
        <motion.div
          style={{
            opacity: overlayOpacity,
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 1)",
            zIndex: 2,
            willChange: "opacity",
          }}
        />

        {/* Section 1 foreground content */}
        {children && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {children}
          </div>
        )}
      </div>

      {/* ── SECTION 2: Overlapping panel ── */}
      {/*
        margin-top: -100vh pulls Section 2 up so it starts exactly
        at the bottom of Section 1 in the stacking context.
        It slides upward over Section 1 as you scroll.
        z-index: 10 ensures it paints above the sticky section.
        min-height: 100vh keeps it scrollable.
      */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: "-10vh", // slight peek before full overlap
          minHeight: "100vh",
          borderRadius: "28px 28px 0 0", // curved top edge slides in over section 1
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        {overlayContent}
      </div>
    </div>
  );
}
