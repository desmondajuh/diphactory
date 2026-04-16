/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ReactLenis } from "lenis/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const sectionClasses =
  "relative h-screen min-h-screen overflow-hidden scroll-section";

// ─── Panel Data ───────────────────────────────────────────────────────────────
const PANELS = [
  {
    step: 1,
    label: "Book Your Session",
    sub: "Choose your preferred date and photography package. I'll confirm availability and lock in your booking.",
    tag: "Discovery",
    bg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    accent: "#e63946",
  },
  {
    step: 2,
    label: "Creative Direction",
    sub: "We align on mood boards, locations, wardrobe, and the visual language that tells your story.",
    tag: "Planning",
    bg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
    accent: "#f4a261",
  },
  {
    step: 3,
    label: "The Shoot",
    sub: "A focused, immersive session where every frame is crafted with intention. You bring the energy.",
    tag: "Execution",
    bg: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80",
    accent: "#2a9d8f",
  },
  {
    step: 4,
    label: "Final Delivery",
    sub: "Retouched selects delivered in a private gallery within 7 days. Yours to keep, forever.",
    tag: "Delivery",
    bg: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
    accent: "#c77dff",
  },
];

export const ProcessScroll = () => {
  const lenisRef = useRef<any>(null);
  const containerRef = useRef(null);

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
      const sections = document.querySelectorAll(".scroll-section");

      sections.forEach((section, index) => {
        const container = section.querySelector(".scroll-container");

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

        if (index === sections.length - 1) return;

        ScrollTrigger.create({
          trigger: section,
          start: "bottom bottom",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <div className="relative">
      {/* ── Global styles injected once ─────────────────────────────────── */}
      <style>{`
       @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Syne:wght@400;700&display=swap');

        .process-label {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          letter-spacing: -0.03em;
          line-height: 0.92;
        }

        .process-tag {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          letter-spacing: 0.18em;
          font-size: 0.65rem;
          text-transform: uppercase;
        }

        .process-sub {
          font-family: 'Syne', sans-serif;
          font-weight: 400;
          letter-spacing: 0.01em;
          line-height: 1.6;
          font-size: 0.85rem;
        }

        .step-num {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
        }

        .diagonal-card {
          clip-path: polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%);
        }
          
       .scroll-section {
        position: relative;
        width: 100%;
        height: 100svh;
        min-height: 100svh;
        overflow: hidden;
        }

        section.four {
            height: 125svh;
        }

        .scroll-container {
            position: relative;
            width: 100%;
            height: 100%;
            padding: 2rem;
            display: flex;
            /* flex-direction:column; */
            transform: rotate(30deg);
            transform-origin: bottom left;
            /* transform:rotateX(30deg); */
            /* perspective:1000px; */
            will-change: transform;
        }


        .one .scroll-container {
            transform: rotate(0deg);
        }
      `}</style>
      <div className="absolute left-7 top-1/2 -translate-y-1/2 z-9999 flex flex-col items-center gap-3">
        <span
          className="process-tag text-white/40 mb-1"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          My Process
        </span>
        {PANELS.map((p, i) => (
          <div
            key={i}
            className="relative flex items-center justify-center w-7 h-7 rounded-full border border-white/20 cursor-default transition-all duration-500"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="step-num text-[10px] text-white/50 transition-colors duration-500"
              data-active="false"
            >
              {p.step}
            </span>
            {/* accent ring */}
            <div
              className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 ring-ring"
              style={{ boxShadow: `0 0 0 2px ${p.accent}` }}
              data-ring
            />
          </div>
        ))}
      </div>

      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <div ref={containerRef} className="relative">
        <section className={cn("one", sectionClasses)}>
          <div className="scroll-container flex-col bg-red-500">
            <ContentLabel
              step={1}
              label="My Process"
              tag="How I Work"
              sub="I believe in a collaborative approach to photography, where every detail is carefully considered and executed."
              accent="#e63946"
              imageUrl="/images/gallery/2.jpg"
            />
          </div>
        </section>
        <section className={cn("three", sectionClasses)}>
          <div className="scroll-container flex-col bg-green-500">
            <ContentLabel
              step={2}
              label="Creative Direction"
              tag="Planning"
              sub="We align on mood boards, locations, wardrobe, and the visual language that tells your story."
              accent="#f4a261"
              imageUrl="/images/gallery/3.jpg"
            />
          </div>
        </section>

        <section className={cn("three", sectionClasses)}>
          <div className="scroll-container flex-col bg-blue-500">
            <ContentLabel
              step={3}
              label="The Shoot"
              tag="Execution"
              sub="A focused, immersive session where every frame is crafted with intention. You bring the energy."
              accent="#2a9d8f"
              imageUrl="/images/gallery/4.jpg"
            />
          </div>
        </section>

        <section className={cn("four", sectionClasses)}>
          <div className="scroll-container flex-col bg-yellow-500">
            <ContentLabel
              step={4}
              label="Final Delivery"
              tag="Delivery"
              sub="Retouched selects delivered in a private gallery within 7 days. Yours to keep, forever."
              accent="#c77dff"
              imageUrl="/images/gallery/5.jpg"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

interface ContentLabelProps {
  step: number;
  label: string;
  tag: string;
  sub: string;
  accent: string;
  imageUrl?: string;
}
const ContentLabel = ({
  step,
  label,
  tag,
  sub,
  accent,
  imageUrl = "/images/gallery/1.jpg",
}: ContentLabelProps) => {
  return (
    <>
      <div
        className="absolute top-12 right-12 process-label text-white select-none pointer-events-none"
        style={{ fontSize: "clamp(6rem, 14vw, 12rem)", opacity: 0.06 }}
      >
        0{step}
      </div>
      <Image
        src={imageUrl || "/images/gallery/1.jpg"}
        alt="Process Background"
        fill
        className="object-cover"
      />
      <div className="absolute bottom-0 left-0 px-10 pb-16 md:px-16 md:pb-20 max-w-2xl z-10">
        {/* Tag */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-5 h-0.5" style={{ background: accent }} />
          <span className="process-tag text-white/60">{tag}</span>
        </div>

        {/* Headline */}
        <h2
          className="process-label text-white mb-6"
          style={{ fontSize: "clamp(3.2rem, 7.5vw, 7rem)" }}
        >
          {label}
        </h2>

        {/* Sub-copy + CTA card */}
        <div
          className="flex items-end gap-6 p-5 rounded-sm max-w-md"
          style={{
            background: "rgba(10,10,10,0.55)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="process-sub text-white/70 flex-1">{sub}</p>
          <a
            href="#contact"
            className="process-tag text-white whitespace-nowrap px-4 py-2 rounded-sm transition-colors"
            style={{
              background: accent,
              color: "#fff",
              letterSpacing: "0.12em",
              fontSize: "0.6rem",
            }}
          >
            Contact Me ↗
          </a>
        </div>
      </div>
    </>
  );
};
