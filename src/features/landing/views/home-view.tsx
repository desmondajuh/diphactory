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
import { client } from "@/lib/orpc";

export const HomeView = async () => {
  const [
    heroData,
    fullImageData,
    carouselData,
    differenceData,
    processData,
    insightData,
    featuredPosts,
  ] = await Promise.all([
    client.sections.getBySlug({ slug: "home-hero" }),
    client.sections.getBySlug({ slug: "full-hero-mage" }),
    client.sections.getBySlug({ slug: "home-carousel" }),
    client.sections.getBySlug({ slug: "difference-section" }),
    client.sections.getBySlug({ slug: "process-steps" }),
    client.sections.getBySlug({ slug: "posts-section" }),
    client.blog.listFeatured(),
  ]);

  // console.log(heroData);
  // console.log(differenceData);
  // console.log(insightData);

  return (
    <>
      <ReactLenis root>
        <HeroSection
          sectionData={heroData}
          imageSrc="/images/hero-bg4.jpg"
          imageAlt="Diphactory – digital designer and 3D renderer"
        />
        <ParallaxStickySection
          stickySection={<FullImageSection sectionData={fullImageData} />}
          overlaySection={<CarouselSection sectionData={carouselData} />}
          peekAmount="5vh"
        />
        <DifferenceSection sectionData={differenceData} />
        <ProcessScroll sectionData={processData} />
        <LatestInsights sectionData={insightData} posts={featuredPosts} />
        <ImageCTA />
      </ReactLenis>
    </>
  );
};
