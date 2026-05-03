import Image from "next/image";
import { GlobeIcon } from "@/components/icons/globe";
import BlockRevealAnime from "@/components/shared/reveal-anime";
import ParallaxImage from "@/components/shared/parallax-image";
import { SectionWithItems } from "@/lib/db/schema";

interface HeroSectionProps {
  /**
   * Path to the hero portrait image.
   * Replace with your actual image path, e.g. "/images/clivelle.jpg"
   */
  imageSrc?: string;
  imageAlt?: string;
  sectionData: SectionWithItems | null;
}

const sectionDesc =
  "Hi, I am diai®I'm a photographer and highly talented visual artist with over a decade of experience in the field.";

export function HeroSection({
  imageSrc = "/images/bg/bride-bg.jpg",
  imageAlt = "Diphactory – digital designer and 3D renderer",
  sectionData,
}: HeroSectionProps) {
  // fallback values if section not found in DB
  const title = sectionData?.title ?? "DIPHACTORY";
  const subtitle = sectionData?.subtitle ?? sectionDesc;
  const ctaText = sectionData?.ctaText ?? "Get in touch";
  const ctaLink = sectionData?.ctaLink ?? "/contact";
  const bgImage = sectionData?.bgImage ?? null;

  //  const section = await client.sections.getBySlug({ slug: "contact-hero" });

  return (
    <section
      className="relative w-full overflow-hidden bg-(--color-bg-primary)"
      style={{ minHeight: "100svh" }}
      aria-label="Hero"
    >
      <div className="absolute inset-0 z-5 bg-linear-to-b from-black/72 via-transparent to-black/55" />
      {/* ── Full-bleed portrait ── */}
      <div className="absolute inset-0 z-0">
        {/* <Image
          src={imageSrc || "/images/hero-bg.png"}
          alt={imageAlt || "Diphactory – digital designer and photographer"}
          fill
          priority
          sizes="100vw"
          className="md:hidden object-cover object-top opacity-80"
          style={{ objectPosition: "50% 15%" }}
        /> */}
        <ParallaxImage
          src={imageSrc}
          alt={imageAlt}
          className="hidden md:block object-cover object-center opacity-80"
          scale={1.1}
          // style={{ objectPosition: "50% 15%" }}
        />
        {/* Gradient overlays – left, bottom, right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,12,13,0.72) 0%, transparent 40%, transparent 60%, rgba(10,12,13,0.55) 100%)",
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

      {/* ── Decorative: globe icon (far right, lower) ── */}
      <div
        className="absolute right-5 bottom-36 z-20 hidden lg:flex items-center justify-center"
        aria-hidden="true"
      >
        <GlobeIcon />
      </div>

      {/* ── Bottom content row ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col">
        {/* Copyright line */}
        <p className="px-6 md:px-10 lg:px-14 text-sm font-medium text-muted-foreground mb-1 md:mb-2">
          ©2026
        </p>

        {/* Large name + bio row */}
        <div className="flex items-end justify-between px-6 md:px-10 lg:px-14 pb-6 md:pb-10 gap-4">
          {/* Giant headline */}
          <BlockRevealAnime
          // blockColor="#fe0100"
          >
            <h1
              className="font-black uppercase leading-[0.88] tracking-tight text-white select-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(4rem, 13vw, 14rem)",
                lineHeight: 0.88,
              }}
            >
              {title}
              <span className="xhidden xmd:block text-accent-red">*</span>
            </h1>
          </BlockRevealAnime>

          {/* Bio blurb – bottom right */}
          <BlockRevealAnime>
            <p className="hidden md:block max-w-55 lg:max-w-xs text-right text-sm leading-relaxed text-muted-foreground shrink-0 mb-1 lg:mb-2">
              {subtitle}
              {/* Hi, I am diai
              <sup className="text-accent-red text-xs mr-1">®</sup> I&apos;m a
              photographer and highly talented visual artist with over a decade
              of experience in the field. */}
            </p>
          </BlockRevealAnime>
        </div>

        {/* Mobile bio */}
        <p className="md:hidden px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
          {subtitle}
          {/* Hi, I am Diai
          <sup className="text-accent-red text-xs">®</sup> I&apos;m a
          photographer and highly talented visual artist with over a decade of
          experience in the field. */}
        </p>
      </div>
    </section>
  );
}
