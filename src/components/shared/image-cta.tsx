/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ImageCTA() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;

    gsap.fromTo(
      bg,
      { scale: 1.18 },
      {
        scale: 1.0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    /* Outer frame — white bg + padding + rounded border (matches screenshot) */
    <div className="w-full bg-white p-5 border border-gray-200">
      {/* Inner section — clips the zooming bg */}
      <section
        ref={sectionRef}
        className="relative w-full h-90 overflow-hidden rounded-lg"
      >
        {/* Background image layer — this is what GSAP scales */}
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform origin-center"
        >
          {/* Placeholder — swap with Next.js <Image> in production */}
          <img
            src="/images/bg/image-cta-bg.jpg"
            alt="diai image phactory Campaign"
            className="w-full h-full object-cover object-top"
          />

          {/* Darkening overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/15 to-black/50" />
        </div>

        {/* Foreground content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
          {/* Logotype */}
          <div
            className="flex items-center font-black text-white uppercase text-shadow-2xs"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 56px)",
            }}
          >
            DIAI IMAGE PHACTORY
            <span
              className="text-red-600 ml-0.5 leading-none"
              style={{ fontSize: "0.75em" }}
            >
              ✦
            </span>
          </div>

          {/* Tagline */}
          <p className="mt-2.5 text-[11px] font-normal uppercase tracking-[0.4em] text-white/50">
            New Collection 2026
          </p>

          {/* CTA Button */}
          <button className="mt-7 bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white text-[11px] font-bold uppercase tracking-[0.3em] px-9 py-3 rounded-sm cursor-pointer">
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
}
