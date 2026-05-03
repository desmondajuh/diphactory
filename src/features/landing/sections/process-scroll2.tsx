/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ReactLenis } from "lenis/react";
import Image from "next/image";
import Link from "next/link";
import { LensRuler } from "@/components/icons/ruler";
import { SectionWithItems } from "@/lib/db/schema";
import { FALLBACK_PANELS, PANEL_CONFIG } from "@/datas/process-data";

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ─────────────────────────────────────────────────────────────────

const sectionClasses =
  "relative w-full h-[100svh] min-h-[100svh] overflow-hidden scroll-section bg-black";

const containerClasses =
  "relative w-full h-full flex rotate-[30deg] origin-bottom-left will-change-transform flex-col";

// ─── Panel Data ────────────────────────────────────────────────────────────────

// const PANELS = [
//   {
//     step: 1,
//     label: "Book Your Session", //use sectiondata.features.title
//     sub: "Choose your preferred date and photography package. I'll confirm availability and lock in your booking.", //use sectiondata.features.description
//     tag: "Discovery", //use sectiondata.features.icon
//     accent: "#e63025",
//     imageUrl: "/images/gallery/2.jpg", //use sectiondata.features.image
//   },
//   {
//     step: 2,
//     label: "Creative Direction",
//     sub: "We align on mood boards, locations, wardrobe, and the visual language that tells your story.",
//     tag: "Planning",
//     accent: "#f4a261",
//     imageUrl: "/images/gallery/3.jpg",
//   },
//   {
//     step: 3,
//     label: "The Shoot",
//     sub: "A focused, immersive session where every frame is crafted with intention. You bring the energy.",
//     tag: "Execution",
//     accent: "#2a9d8f",
//     imageUrl: "/images/gallery/4.jpg",
//     // extraHeight: true,
//   },
//   {
//     step: 4,
//     label: "Final Delivery",
//     sub: "Retouched selects delivered in a private gallery within 7 days. Yours to keep, forever.",
//     tag: "Delivery",
//     accent: "#c77dff",
//     imageUrl: "/images/gallery/5.jpg",
//   },
// ];

// ─── Ruler ─────────────────────────────────────────────────────────────────────

function Ruler() {
  return (
    <div className="absolute top-0 left-0 right-0 z-20" aria-hidden="true">
      <LensRuler borderPosition="bottom" className="mt-2" />
    </div>
  );
}

// ─── Panel content ─────────────────────────────────────────────────────────────

interface ContentLabelProps {
  step: number;
  label: string;
  tag: string;
  sub: string;
  accent: string;
  imageUrl: string;
  totalSteps: number;
}

const ContentLabel = ({
  step,
  label,
  tag,
  sub,
  accent,
  imageUrl,
  totalSteps,
}: ContentLabelProps) => {
  return (
    <div className="relative w-full h-full">
      {/* ── Ruler ── */}
      <Ruler />

      {/* ── Background image ── */}
      <Image
        src={imageUrl}
        alt={`Process step ${step} – ${label}`}
        fill
        sizes="100vw"
        priority={step === 1}
        unoptimized
        className="object-cover object-center"
      />

      {/* ── Base gradient – bottom legibility ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.12) 75%, transparent 100%)",
        }}
      />

      {/* ── Scroll-out dim overlay (animated via GSAP on parent) ── */}
      <div
        className="panel-dim absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* ── Ghost step number ── */}
      <div
        className="ghost-num absolute top-10 right-10 font-black text-white select-none pointer-events-none leading-none tracking-tighter"
        style={{
          fontSize: "clamp(7rem, 16vw, 14rem)",
          opacity: 0.055,
          fontFamily: "var(--font-display)",
        }}
        aria-hidden="true"
      >
        0{step}
      </div>

      {/* ── Bottom left content ── */}
      <div className="panel-content absolute bottom-0 left-0 z-10 px-10 pb-14 md:px-16 md:pb-20 max-w-2xl">
        {/* Tag line */}
        <div className="panel-tag flex items-center gap-3 mb-4 opacity-0 translate-y-4">
          <div
            className="h-px w-5 shrink-0 rounded-full"
            style={{ background: accent }}
          />
          <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-white/60">
            My Process &nbsp;·&nbsp; {tag}
          </span>
        </div>

        {/* Step pills row */}
        <div className="panel-pills flex items-center gap-2 mb-5 opacity-0 translate-y-4">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const isActive = i + 1 === step;
            const isPast = i + 1 < step;
            return (
              <div
                key={i}
                className="flex h-6.5 w-6.5 items-center justify-center rounded-full text-[10px] font-bold transition-all"
                style={{
                  background: isActive
                    ? "#fff"
                    : isPast
                      ? "rgba(255,255,255,0.18)"
                      : "transparent",
                  color: isActive
                    ? "#0a0a0a"
                    : isPast
                      ? "rgba(255,255,255,0.45)"
                      : "rgba(255,255,255,0.25)",
                  border:
                    isActive || isPast
                      ? "none"
                      : "1px solid rgba(255,255,255,0.2)",
                  transform: isActive ? "scale(1.12)" : "scale(1)",
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>

        {/* Headline */}
        <h2
          className="panel-headline text-white mb-6 font-light leading-[0.92] tracking-[-0.03em] opacity-0 translate-y-6"
          style={{
            fontSize: "clamp(3rem, 7.5vw, 7rem)",
            fontFamily: "var(--font-display)",
          }}
        >
          {label}
        </h2>

        {/* Sub copy + CTA */}
        <div
          className="panel-cta flex flex-col md:flex-row items-end gap-5 rounded-sm max-w-md opacity-0 translate-y-6"
          style={{
            background: "rgba(8,8,8,0.58)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "18px 20px",
          }}
        >
          <p className="text-[0.84rem] font-normal tracking-[0.01em] leading-[1.65] text-white/70 flex-1">
            {sub}
          </p>
          <Link
            href="#contact"
            className="shrink-0 whitespace-nowrap rounded-sm px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-80"
            style={{ background: accent, letterSpacing: "0.12em" }}
          >
            Contact Me ↗
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────

interface ProcessScrollProps {
  sectionData: SectionWithItems | null;
}

export const ProcessScroll = ({ sectionData }: ProcessScrollProps) => {
  const PANELS = sectionData?.featureItems?.length
    ? sectionData.featureItems.map((item, i) => ({
        step: i + 1,
        label: item.title,
        sub: item.description ?? "",
        tag: item.icon ?? "",
        accent: PANEL_CONFIG[i]?.accent ?? "#e63025",
        imageUrl:
          item.image ?? FALLBACK_PANELS[i]?.imageUrl ?? "/images/gallery/2.jpg",
      }))
    : FALLBACK_PANELS;

  const lenisRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync Lenis RAF with GSAP ticker
  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    lenisRef.current?.lenis?.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>(".scroll-section");
      const indicator = document.getElementById("scroll-indicator");

      // ── Fade in the side indicator once page loads ──
      // gsap.to(indicator, {
      //   opacity: 1,
      //   pointerEvents: "auto",
      //   duration: 0.8,
      //   delay: 0.5,
      //   ease: "power2.out",
      // });
      gsap.set(indicator, { opacity: 0, x: -8, pointerEvents: "none" });

      // Replace with this:
      ScrollTrigger.create({
        trigger: containerRef.current, // the whole process section wrapper
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () =>
          gsap.to(indicator, {
            opacity: 1,
            pointerEvents: "auto",
            duration: 0.5,
            ease: "power2.out",
          }),
        onLeave: () =>
          gsap.to(indicator, {
            opacity: 0,
            pointerEvents: "none",
            duration: 0.4,
            ease: "power2.in",
          }),
        onEnterBack: () =>
          gsap.to(indicator, {
            opacity: 1,
            pointerEvents: "auto",
            duration: 0.5,
            ease: "power2.out",
          }),
        onLeaveBack: () =>
          gsap.to(indicator, {
            opacity: 0,
            pointerEvents: "none",
            duration: 0.4,
            ease: "power2.in",
          }),
      });

      // Set initial state
      gsap.set(indicator, { opacity: 0, x: -8, pointerEvents: "none" });

      // In onEnter / onEnterBack:
      gsap.to(indicator, {
        opacity: 1,
        x: 0,
        pointerEvents: "auto",
        duration: 0.5,
        ease: "power2.out",
      });

      // In onLeave / onLeaveBack:
      gsap.to(indicator, {
        opacity: 0,
        x: -8,
        pointerEvents: "none",
        duration: 0.4,
        ease: "power2.in",
      });

      // ─────────────────────────────────────────────
      // ✅ GLOBAL SNAP CONTROLLER (THE IMPORTANT PART)
      // ─────────────────────────────────────────────
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",

        snap: {
          snapTo: 1 / (sections.length - 1),
          duration: { min: 0.2, max: 0.6 },
          delay: 0.05,
          ease: "power1.inOut",
        },
      });

      sections.forEach((section, index) => {
        const container =
          section.querySelector<HTMLElement>(".scroll-container");
        const panelTag = section.querySelector<HTMLElement>(".panel-tag");
        const panelPills = section.querySelector<HTMLElement>(".panel-pills");
        const panelHeadline =
          section.querySelector<HTMLElement>(".panel-headline");
        const panelCta = section.querySelector<HTMLElement>(".panel-cta");
        const panelDim = section.querySelector<HTMLElement>(".panel-dim");
        const indicatorItem = document.getElementById(`indicator-${index}`);

        // ── 1. Rotation entrance ──
        if (container) {
          gsap.to(container, {
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 20%",
              scrub: true,
            },
          });
        }

        // ── 2. Content stagger in ──
        const contentEls = [
          panelTag,
          panelPills,
          panelHeadline,
          panelCta,
        ].filter(Boolean);
        if (contentEls.length) {
          gsap.to(contentEls, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "none",
            // ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 25%",
              toggleActions: "play none none reverse",
            },
          });
        }

        // ── 3. Scroll indicator active state ──
        if (indicatorItem) {
          const ring =
            indicatorItem.querySelector<HTMLElement>(".indicator-ring");
          const fill =
            indicatorItem.querySelector<HTMLElement>(".indicator-fill");
          const num =
            indicatorItem.querySelector<HTMLElement>(".indicator-num");

          ScrollTrigger.create({
            trigger: section,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => {
              gsap.to(ring, { opacity: 1, duration: 0.3 });
              gsap.to(fill, { opacity: 1, scale: 1, duration: 0.3 });
              gsap.to(num, { color: "#fff", duration: 0.3 });
              gsap.to(indicatorItem, {
                borderColor: "rgba(255,255,255,0.0)",
                duration: 0.3,
              });
            },
            onLeave: () => {
              gsap.to(ring, { opacity: 0, duration: 0.3 });
              gsap.to(fill, { opacity: 0.35, scale: 0.6, duration: 0.3 });
              gsap.to(num, { color: "rgba(255,255,255,0.45)", duration: 0.3 });
            },
            onEnterBack: () => {
              gsap.to(ring, { opacity: 1, duration: 0.3 });
              gsap.to(fill, { opacity: 1, scale: 1, duration: 0.3 });
              gsap.to(num, { color: "#fff", duration: 0.3 });
            },
            onLeaveBack: () => {
              gsap.to(ring, { opacity: 0, duration: 0.3 });
              gsap.to(fill, { opacity: 0, duration: 0.3 });
              gsap.to(num, { color: "rgba(255,255,255,0.45)", duration: 0.3 });
            },
          });
        }

        // ── 4. Dim overlay as panel scrolls out ──
        if (panelDim && index < sections.length - 1) {
          gsap.to(panelDim, {
            opacity: 0.6,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "bottom 80%",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // ── 5. Pin (all except last) ──
        if (index < sections.length - 1) {
          ScrollTrigger.create({
            trigger: section,
            // start: "bottom bottom",
            start: "top top",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
          });
        }
      });
    },
    { scope: containerRef },
  );

  return (
    <div className="relative">
      <ReactLenis
        root
        // options={{ autoRaf: false }}
        options={{
          autoRaf: false,
          lerp: 0.08, // slightly tighter
          wheelMultiplier: 0.9, // less aggressive scroll
        }}
        ref={lenisRef}
      />

      {/* Side scroll indicator — outside containerRef so it's fixed relative to viewport */}
      {/* ─── Vertical scroll indicator ────────── */}
      <div
        className="scroll-indicator fixed left-7 top-1/2 -translate-y-1/2 z-9999 flex-col items-center gap-3 opacity-0 pointer-events-none hidden lg:flex"
        id="scroll-indicator"
        style={{ opacity: 0 }} // ← hard default, GSAP overrides this
        aria-hidden="true"
      >
        {/* "My Process" vertical label */}
        <span
          className="text-[0.62rem] font-bold tracking-[0.2em] uppercase text-white/35 mb-1"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          My Process
        </span>

        {PANELS.map((p, i) => (
          <div
            key={i}
            id={`indicator-${i}`}
            className="relative flex items-center justify-center w-7 h-7 rounded-full transition-all duration-500 cursor-default"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {/* Step number */}
            <span className="text-[10px] font-bold text-white/45 transition-colors duration-400 indicator-num">
              {p.step}
            </span>
            {/* Accent ring — toggled active */}
            <div
              className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-400 pointer-events-none indicator-ring"
              style={{ boxShadow: `0 0 0 2px ${p.accent}` }}
            />
            {/* Active dot inside */}
            <div
              className="absolute inset-1.5 rounded-full opacity-0 transition-all duration-400 indicator-fill"
              style={{ background: p.accent }}
            />
          </div>
        ))}

        {/* Scroll hint arrow */}
        <div className="mt-2 flex flex-col items-center gap-1 opacity-40">
          <div
            className="w-px bg-white/40"
            style={{
              height: "28px",
              animation: "scrollPulse 2s ease-in-out infinite",
            }}
          />
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="white"
            opacity="0.5"
          >
            <polygon points="5,10 0,0 10,0" />
          </svg>
        </div>

        <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.2; transform: scaleY(0.5); transform-origin: top; }
          50%       { opacity: 0.8; transform: scaleY(1);   transform-origin: top; }
        }
      `}</style>
      </div>

      <div ref={containerRef} className="relative">
        {PANELS.map((panel, i) => (
          <section
            key={panel.step}
            className={cn(
              sectionClasses,
              // panel.extraHeight && "h-[125svh] min-h-[125svh]",
            )}
          >
            <div
              className={cn(
                "scroll-container",
                containerClasses,
                // First panel starts already rotated to 0 (no rotation entrance)
                i === 0 && "rotate-0",
              )}
            >
              <ContentLabel
                step={panel.step}
                label={panel.label}
                tag={panel.tag}
                sub={panel.sub}
                accent={panel.accent}
                imageUrl={panel.imageUrl}
                totalSteps={PANELS.length}
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
