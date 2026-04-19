// import Image from "next/image";
import BlockRevealAnime from "@/components/shared/reveal-anime";
import ParallaxImage from "@/components/shared/parallax-image";
import { ArrowDown } from "lucide-react";

interface PageHeroProps {
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
  pageDesc?: string;
}

export function PageHero({
  title = "About Dip",
  imageSrc = "/images/bg/bride-bg.jpg",
  imageAlt = "Diphactory – page hero",
  pageDesc = "Hi, I am Diai. I'm a photographer and highly talented visual artist with over a decade of experience in the field.",
}: PageHeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden bg-(--color-bg-primary)"
      style={{ minHeight: "60svh" }}
      aria-label="pageHero"
    >
      {/* <div className="absolute inset-0 z-5 bg-linear-to-b from-black/62 via-transparent to-black/55" /> */}
      {/* ── Full-bleed portrait ── */}
      <div className="absolute inset-0 z-0">
        {/* <Image
          src={imageSrc || "/images/hero-bg.png"}
          alt={imageAlt || "Diphactory – digital designer and photographer"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-80"
          style={{ objectPosition: "50% 15%" }}
        /> */}
        <ParallaxImage
          src={imageSrc}
          alt={imageAlt}
          className="object-cover object-center opacity-100"
          scale={1.1}
          // style={{ objectPosition: "50% 15%" }}
        />
        {/* Gradient overlays – left, bottom, right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,12,13,0.72) 0%, transparent 40%, transparent 60%, rgba(10,12,13,0.35) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,12,13,0.92) 0%, rgba(10,12,13,0.45) 35%, transparent 65%)",
          }}
        />
      </div>

      {/* ── Bottom content row ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col">
        {/* Copyright line */}
        <p className="px-6 md:px-10 lg:px-14 text-lg font-medium text-muted-foreground mb-1 md:mb-2">
          ©2026
        </p>

        {/* Large name + bio row */}
        <div className="flex items-end justify-between px-6 md:px-10 lg:px-14 pb-6 md:pb-10 gap-4">
          {/* Giant headline */}
          <BlockRevealAnime
          // blockColor="#fe0100"
          >
            <h1
              className="font-bold leading-[0.88] text-white select-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 11vw, 10rem)",
                lineHeight: 0.88,
              }}
            >
              {title}
              <span className="text-accent-red">*</span>
            </h1>
          </BlockRevealAnime>

          {/* Bio blurb – bottom right */}
          <BlockRevealAnime>
            <p className="hidden md:block xmax-w-55 md:max-w-md text-right text-sm leading-relaxed text-muted-foreground shrink-0 mb-1 lg:mb-2">
              {pageDesc}
            </p>
          </BlockRevealAnime>

          <div className="rounded-full p-2.5 xborder xborder-white font-black">
            <ArrowDown className="animate-bounce" />
          </div>
        </div>

        {/* Mobile bio */}
        <p className="md:hidden px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
          {pageDesc}
        </p>
      </div>
    </section>
  );
}
