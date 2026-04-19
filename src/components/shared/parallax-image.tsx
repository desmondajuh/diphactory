/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/lib/utils";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  scale?: number; // Optional prop to control the zoom level (default is 1.25)
  style?: React.CSSProperties;
}

const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

export default function ParallaxImage({
  src,
  alt,
  className,
  scale = 1.25,
  style,
}: ParallaxImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const bounds = useRef(null as null | { top: number; bottom: number });
  const currentTranslateY = useRef(0);
  const targetTranslateY = useRef(0);
  const rafId = useRef(null as null | number);

  useEffect(() => {
    const updateBounds = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        bounds.current = {
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
        };
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);

    const animate = () => {
      if (imageRef.current) {
        currentTranslateY.current = lerp(
          currentTranslateY.current,
          targetTranslateY.current,
          0.1,
        );

        if (
          Math.abs(currentTranslateY.current - targetTranslateY.current) > 0.1
        ) {
          imageRef.current.style.transform = `translateY(${currentTranslateY.current}px) scale(${scale})`;
          // rafId.current = requestAnimationFrame(animate);
        }
      }
      rafId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateBounds);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  useLenis(({ scroll }) => {
    if (!bounds.current) return;
    const relativeScroll = scroll - bounds.current.top;
    targetTranslateY.current = relativeScroll * 0.2; // Adjust the multiplier for more/less parallax
  });

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      className={cn(
        "object-cover xtransition-transform xduration-700",
        className,
      )}
      style={{
        willChange: "transform",
        transform: "translateY(0) scale(1.25)",
        ...style,
      }}
    />
  );
}
