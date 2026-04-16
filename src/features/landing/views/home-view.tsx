import { ProcessScroll } from "@/sections/process-raw";
import { HeroSection } from "@/features/landing/sections/hero-section";
import { CarouselSection } from "@/features/landing/sections/carousel-section";
import { DifferenceSection } from "@/features/landing/sections/difference-section";
import { FullImageSection } from "@/features/landing/sections/full-image-section";
import { ParallaxStickySection } from "@/features/landing/sections/parallax-sticky-section";

export const HomeView = () => {
  return (
    <>
      <HeroSection
        imageSrc="/images/hero-bg4.jpg"
        imageAlt="Diphactory – digital designer and 3D renderer"
      />
      <ParallaxStickySection
        stickySection={<FullImageSection />}
        overlaySection={<CarouselSection />}
        peekAmount="5vh"
      />
      <DifferenceSection />
      <ProcessScroll />
    </>
  );
};
