"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface AnimatedButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

export default function AnimatedButton({
  label,
  onClick,
  className = "",
}: AnimatedButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const circleRef = useRef<HTMLSpanElement>(null);
  const arrowIconRef = useRef<SVGSVGElement>(null);

  // ── Store the true resting width so leave always snaps to the same value ──
  const restWidth = useRef<number>(36);

  useEffect(() => {
    const btn = btnRef.current;
    const fill = fillRef.current;
    if (!btn || !fill) return;

    // Measure the actual rendered circle height as the resting width
    // (circle height == inner height == button height minus top+bottom padding 6px each)
    const h = btn.getBoundingClientRect().height - 12; // 12 = 6px top + 6px bottom inset
    restWidth.current = h;

    // Let GSAP own the width from the start — prevents React/GSAP conflicts
    gsap.set(fill, { width: h });
  }, []);

  const handleEnter = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const fullWidth = btn.getBoundingClientRect().width - 12; // subtract 6px insets

    gsap.killTweensOf([
      fillRef.current,
      textRef.current,
      circleRef.current,
      arrowIconRef.current,
    ]);

    gsap.to(fillRef.current, {
      width: fullWidth,
      duration: 0.35,
      ease: "power3.inOut",
      force3D: true,
    });

    gsap.to(textRef.current, {
      color: "#ffffff",
      duration: 0.2,
      ease: "power2.out",
    });

    gsap.to(circleRef.current, {
      opacity: 0,
      duration: 0.12,
    });

    gsap.fromTo(
      arrowIconRef.current,
      { x: -4, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.25, ease: "power2.out", delay: 0.15 },
    );
  };

  const handleLeave = () => {
    gsap.killTweensOf([
      fillRef.current,
      textRef.current,
      circleRef.current,
      arrowIconRef.current,
    ]);

    // Collapse fill back to the exact measured circle size
    gsap.to(fillRef.current, {
      width: restWidth.current,
      duration: 0.32,
      ease: "power3.inOut",
      force3D: true,
    });

    gsap.to(textRef.current, {
      color: "#1f2937",
      duration: 0.2,
      ease: "power2.out",
    });

    gsap.to(circleRef.current, {
      opacity: 1,
      duration: 0.2,
      delay: 0.12,
    });

    gsap.to(arrowIconRef.current, {
      opacity: 0,
      x: 4,
      duration: 0.15,
      ease: "power2.in",
    });
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`relative flex items-center rounded-full border border-gray-200 bg-white cursor-pointer select-none p-1.5 pr-5 ${className}`}
    >
      {/* ── Expanding fill — inset 6px on all sides so white gap always shows ── */}
      <span
        ref={fillRef}
        className="absolute left-1.5 top-1.5 bottom-1.5 rounded-full bg-accent-red pointer-events-none"
      />

      {/* ── Red circle + arrow at rest ── */}
      <span
        ref={circleRef}
        className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-accent-red shrink-0"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 7h8M7.5 3.5L11 7l-3.5 3.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* ── Label ── */}
      <span
        ref={textRef}
        className="relative z-10 mx-3 text-sm font-medium text-gray-800 whitespace-nowrap"
      >
        {label}
      </span>

      {/* ── Arrow that fades in on the right on hover ── */}
      <svg
        ref={arrowIconRef}
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="relative z-10 shrink-0"
        style={{ opacity: 0 }}
      >
        <path
          d="M3 7h8M7.5 3.5L11 7l-3.5 3.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
