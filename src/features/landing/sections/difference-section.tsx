"use client";
import { FocusBrackets } from "@/components/icons/focus-bracket";
import { LensRuler } from "@/components/icons/ruler";
import AvatarGroup from "@/components/shared/avatar-group";
import ParallaxImage from "@/components/shared/parallax-image";
import { Button } from "@/components/ui/button";
import { BUSINESS_INSTAGRAM_URL } from "@/constants";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─── Mosaic image placeholders ─────────────────────────────────────────────────
// Replace these src values with real gallery images
const MOSAIC_IMAGES = [
  { src: "/images/gallery/1.jpg", alt: "Editorial portrait" },
  { src: "/images/gallery/2.jpg", alt: "Black and white portrait" },
  { src: "/images/gallery/3.jpg", alt: "Fashion editorial" },
  { src: "/images/gallery/4.jpg", alt: "Studio portrait" },
  { src: "/images/gallery/5.jpg", alt: "Product photography" },
  { src: "/images/gallery/6.jpg", alt: "Lifestyle photography" },
  { src: "/images/gallery/7.jpg", alt: "Outdoor portrait" },
  { src: "/images/gallery/8.jpg", alt: "Color portrait" },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export function DifferenceSection() {
  return (
    <section
      className="relative xmin-h-screen flex flex-col items-center md:justify-end overflow-hidden bg-[#0a0a0a] pt-14 pb-0"
      aria-label="About the photographer"
    >
      <Image
        src="/images/camera-illustration.png"
        alt="camera-illustration"
        width={500}
        height={500}
        className="absolute -top-14 left-0 "
      />

      {/* ── MAIN GRID ── */}
      <div className="grid gap-3.5 px-7 lg:grid-cols-[1.6fr_1fr_1.4fr] md:grid-cols-2 grid-cols-1">
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col justify-center gap-0 pt-2 md:col-span-2 lg:col-span-1">
          {/* Headline */}
          <h2
            className="mb-8 font-light leading-[0.92] tracking-[-0.03em] text-white"
            style={{
              fontSize: "clamp(3rem, 7.5vw, 6rem)",
              fontFamily: "var(--font-display)",
            }}
          >
            Difference Behind my lens that Truly matters
          </h2>

          {/* Body + scroll button */}
          <div className="flex flex-col gap-5 pl-12">
            <p className="max-w-60 text-sm leading-[1.7] text-white/45">
              Through my lens, I capture raw emotions, authentic connections,
              and fleeting details that transform your moments into lasting,
              unforgettable stories.
            </p>
            <Button
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-all duration-300 hover:border-white/60 hover:bg-white/8 cursor-pointer"
              aria-label="Scroll down"
              onClick={() =>
                window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
              }
            >
              <ArrowDown
                size={16}
                strokeWidth={2.5}
                // className="animate-bounce"
              />
            </Button>
          </div>
        </div>

        {/* ── MIDDLE COLUMN ── */}
        <div className="flex flex-col md:justify-end gap-3.5">
          {/* Stat card */}
          <div className="flex flex-col items-center gap-2.5 rounded-[20px] bg-white px-6 py-7 text-center">
            <span
              className="font-black leading-none tracking-tight text-[#0a0a0a]"
              style={{ fontFamily: "var(--font-display)", fontSize: "3.2rem" }}
            >
              2.5k
            </span>
            <span className="text-[13px] font-medium text-black/45">
              Happy Clients Captured
            </span>
            {/* Avatar stack */}
            <div className="flex items-center">
              <AvatarGroup />
              {/* {AVATAR_COLORS.map((colors, i) => (
                <div
                  key={i}
                  className={`h-9 w-9 shrink-0 rounded-full border-[2.5px] border-white bg-linear-to-br ${colors} overflow-hidden`}
                  style={{
                    marginLeft: i === 0 ? 0 : "-10px",
                    zIndex: AVATAR_COLORS.length - i,
                  }}
                />
              ))} */}
            </div>
          </div>

          {/* Instagram card */}
          <div
            className="group relative overflow-hidden rounded-[20px]"
            style={{ aspectRatio: "3/2.2" }}
          >
            {/* <Image
              src="/images/gallery/9.jpg"
              alt="Photography – woman in red standing in golden field"
              fill
              sizes="(max-width: 900px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            /> */}
            <ParallaxImage
              src="/images/gallery/9.jpg"
              alt="Photography – woman in red standing in golden field"
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)",
              }}
            />
            <Link
              href={BUSINESS_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-5 flex items-center gap-2.5 text-sm font-semibold text-white transition-gap duration-200 hover:gap-3.5"
            >
              Check My Instagram
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col md:justify-between gap-3.5">
          {/* Focus/portrait card with bracket overlay */}
          <div
            className="group relative overflow-hidden rounded-[20px]"
            style={{ aspectRatio: "16/9" }}
          >
            <Image
              src="/images/gallery/10.jpg"
              alt="Portrait – man with authentic expression"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)",
              }}
            />
            {/* Focus brackets */}
            <FocusBrackets />
            {/* Caption */}
            <p
              className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-10 text-center text-[13px] leading-relaxed text-white/85"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
              }}
            >
              Capture authentic emotions with timeless photography that
              preserves your most beautiful memories.
            </p>
          </div>

          {/* Mosaic photo grid */}
          <div className="overflow-hidden rounded-[20px]">
            <div className="grid grid-cols-4 gap-0.75">
              {MOSAIC_IMAGES.map((img, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="10vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
            {/* Text card below mosaic */}
            <div className="bg-[#111] px-5 py-4">
              <p className="text-[13px] leading-[1.65] text-white/60">
                Enjoy a relaxed, stress-free photoshoot, focusing on real
                moments while I capture every detail beautifully.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RULER ── */}
      <LensRuler borderPosition="top" />
    </section>
  );
}
