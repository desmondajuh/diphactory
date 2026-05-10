// import { ProcessScroll } from "@/sections/process-raw";
import { ProcessScroll } from "@/features/landing/sections/process-scroll2";
import { HeroSection } from "@/features/landing/sections/hero-section";
import { CarouselSection } from "@/features/landing/sections/carousel-section";
import { DifferenceSection } from "@/features/landing/sections/difference-section";
import { FullImageSection } from "@/features/landing/sections/full-image-section";
import { ParallaxStickySection } from "@/features/landing/sections/parallax-sticky-section2";
import { ReactLenis } from "lenis/react";
import { ImageCTA } from "@/components/shared/image-cta";
import LatestInsights from "../sections/insights-section";
import { MapSection } from "../sections/map-section";
import { StudioMapSection } from "../sections/map-section2";
import { client } from "@/lib/orpc";

export const HomeView = async () => {
  const [
    heroData,
    fullImageData,
    carouselData,
    differenceData,
    differenceGalleryData,
    processData,
    insightData,
    featuredPosts,
  ] = await Promise.all([
    client.sections.getBySlug({ slug: "home-hero" }),
    client.sections.getBySlug({ slug: "full-hero-mage" }),
    client.sections.getBySlug({ slug: "home-carousel" }),
    client.sections.getBySlug({ slug: "difference-section" }),
    client.sections.getBySlug({ slug: "difference-section-gallery" }),
    client.sections.getBySlug({ slug: "process-steps" }),
    client.sections.getBySlug({ slug: "posts-section" }),
    client.blog.listFeatured(),
  ]);

  return (
    <>
      <ReactLenis root>
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.03] z-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <HeroSection
          title={heroData.title || "DIPHACTORY"}
          subtitle={heroData.subtitle || ""}
          sectionData={heroData}
          badge={heroData.badge || ""}
          // badge={heroData.badge || "©2026"}
          imageSrc={heroData.image || "/images/bg/bride-bg.jpg"}
          bgImageSrc={heroData.bgImage || "/images/bg/bride-portrait.jpg"}
          imageAlt={heroData.imageAlt || "DIP Hero background"}
        />
        <ParallaxStickySection
          stickySection={<FullImageSection sectionData={fullImageData} />}
          overlaySection={<CarouselSection sectionData={carouselData} />}
          peekAmount="5vh"
        />
        <DifferenceSection
          sectionData={differenceData}
          galleryData={differenceGalleryData}
        />
        <ProcessScroll sectionData={processData} />
        <LatestInsights sectionData={insightData} posts={featuredPosts} />
        <ImageCTA className="bg-accent-brand-950" />
        <MapSection />
        {/* <StudioMapSection /> */}
      </ReactLenis>
    </>
  );
};
