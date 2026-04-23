"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxStickySectionProps {
  /** The sticky fullscreen section (e.g. FullImageSection2) */
  stickySection: React.ReactNode;
  /** The section that slides up and overlaps */
  overlaySection: React.ReactNode;
  /** How much the overlay peeks before fully entering. Default "10vh" */
  peekAmount?: string;

  /** Background color transition */
  bgFrom?: string;
  bgTo?: string;
}

export function ParallaxStickySection({
  stickySection,
  overlaySection,
  peekAmount = "10vh",
  bgFrom = "#080808",
  bgTo = "#dddddd",
}: ParallaxStickySectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageScaleRef = useRef<HTMLDivElement>(null);
  const dimOverlayRef = useRef<HTMLDivElement>(null);

  const peerAmountValue = parseFloat(peekAmount);
  const peerAmountUnit = peekAmount.replace(peerAmountValue.toString(), "");
  const totalScrollHeight =
    200 - (peerAmountUnit === "vh" ? peerAmountValue : 0);
  const totalHeightStr = totalScrollHeight + "vh";

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const imageScaleEl = imageScaleRef.current;
    const dimOverlayEl = dimOverlayRef.current;

    if (!wrapper || !imageScaleEl || !dimOverlayEl) return;

    // Set initial background color on the wrapper
    gsap.set(wrapper, { backgroundColor: bgFrom });

    // ── Background color tween: triggers when wrapper is 30% into viewport ──
    const bgTween = gsap.to(wrapper, {
      backgroundColor: bgTo,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top 70%", // when top of wrapper hits 70% from top = 30% into viewport
        end: "top 20%",
        scrub: true,
      },
    });

    // ── Scale + dim overlay: tied to the full sticky scroll range ──
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;

        // Image scale: [0.35, 1] → [1, 0.58]
        const scaleClamped = Math.max(0, Math.min(1, (p - 0.35) / (1 - 0.35)));
        gsap.set(imageScaleEl, { scale: 1 + scaleClamped * (0.58 - 1) });

        // Dim overlay opacity: [0.25, 0.92] → [0, 1]
        const opClamped = Math.max(0, Math.min(1, (p - 0.25) / (0.92 - 0.25)));
        gsap.set(dimOverlayEl, { opacity: opClamped });
      },
    });

    return () => {
      bgTween.scrollTrigger?.kill();
      bgTween.kill();
      st.kill();
    };
  }, [bgFrom, bgTo]);

  return (
    <div
      ref={wrapperRef}
      className="mb-12 md:mb-0"
      style={{
        position: "relative",
        height: totalHeightStr,
        backgroundColor: bgFrom,
      }}
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
        {/* Image zoom layer */}
        <div
          ref={imageScaleRef}
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          {stickySection}
        </div>

        {/* Dim overlay */}
        <div
          ref={dimOverlayRef}
          style={{
            opacity: 0,
            position: "absolute",
            inset: 0,
            zIndex: 2,
            willChange: "opacity",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── Overlapping section ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: `-${peekAmount}`,
          borderRadius: "28px 28px 0 0",
          overflow: "hidden",
          background: "#ffffff",
          boxShadow: "0 -12px 48px rgba(0,0,0,0.22)",
        }}
      >
        {overlaySection}
      </div>
    </div>
  );
}
