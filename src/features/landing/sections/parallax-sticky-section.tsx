"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";

interface ParallaxStickySectionProps {
  /** The sticky fullscreen section (e.g. FullImageSection2) */
  stickySection: React.ReactNode;
  /** The section that slides up and overlaps */
  overlaySection: React.ReactNode;
  /** How much the overlay peeks before fully entering. Default "10vh" */
  peekAmount?: string;
}

export function ParallaxStickySection({
  stickySection,
  overlaySection,
  peekAmount = "10vh",
}: ParallaxStickySectionProps) {
  const peerAmountValue = parseFloat(peekAmount);
  const peerAmountUnit = peekAmount.replace(peerAmountValue.toString(), "");
  const totalScrollHeight =
    200 - (peerAmountUnit === "vh" ? peerAmountValue : 0);
  const peerAmountInPixels = totalScrollHeight + "vh";

  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Zoom: 1 → 1.18 as overlay scrolls in
  const imageScale = useTransform(scrollYProgress, [0.35, 1], [1, 0.58]);
  // Dim: 0 → 0.78 opacity on the black overlay
  const overlayOpacity = useTransform(scrollYProgress, [0.25, 0.92], [0, 1]);

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", height: peerAmountInPixels }}
    >
      {/* ── Sticky panel ── */}
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
        {/* Image zoom layer — wraps the sticky section */}
        <motion.div
          style={{
            scale: imageScale,
            position: "absolute",
            inset: 0,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          {stickySection}
        </motion.div>

        {/* Dim overlay */}
        <motion.div
          style={{
            opacity: overlayOpacity,
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,1)",
            zIndex: 2,
            willChange: "opacity",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── Overlapping section ── */}
      <div
        style={{
          //   height: "105vh",
          position: "relative",
          zIndex: 10,
          marginTop: `-${peekAmount}`,
          borderRadius: "28px 28px 0 0",
          overflow: "hidden",
          background: "#ffffff",
          boxShadow: "0 -12px 48px rgba(0,0,0,0.22)",
        }}
        className="bg-green-500"
      >
        {overlaySection}
      </div>
    </div>
  );
}
