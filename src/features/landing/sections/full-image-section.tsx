import { SectionWithItems } from "@/lib/db/schema";
import Image from "next/image";
// import { motion } from "motion/react";

interface FullImageSectionProps {
  sectionData: SectionWithItems | null;
}

export const FullImageSection = ({ sectionData }: FullImageSectionProps) => {
  const badge = sectionData?.badge ?? "Visual Direction";
  const title = sectionData?.title ?? "DIP";
  const subtitle = sectionData?.subtitle ?? "";
  const image = sectionData?.image ?? "";
  const imageAlt = sectionData?.imageAlt ?? "";
  return (
    // h-screen fills the sticky 100vh container exactly
    // overflow-hidden prevents zoomed image spilling outside
    <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute flex w-full h-full items-center justify-center">
        <h1
          className="text-brand/10 text-center"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(4.5rem, 12vw, 12rem)",
          }}
        >
          WELCOME TO <br />
          DIAL IMAGE PHACTORY
        </h1>
      </div>
      <Image
        src={image || "/images/bg/parallax-bg-transparent.png"}
        alt={imageAlt || "Diphactory – digital designer and 3D renderer"}
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />

      {/* Foreground content sits above the image */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-5">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-white text-shadow-lg">
          {badge}
        </p>
        <h1
          className="font-black text-white leading-none tracking-tight text-shadow-lg"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem, 9vw, 9rem)",
          }}
        >
          {title}
          <span className="text-accent-brand">*</span>
        </h1>
        <p className="max-w-md text-base text-white leading-relaxed  text-shadow-lg">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
