// wherever CarouselSection is used in your landing page
import { client } from "@/lib/orpc";
import { CarouselClient } from "./carousel-client";
import { SectionWithItems } from "@/lib/db/schema";

interface CarouselSectionProps {
  sectionData: SectionWithItems | null;
}

export const CarouselSection = async ({
  sectionData,
}: CarouselSectionProps) => {
  const carouselImages = await client.carousel.list();
  return <CarouselClient images={carouselImages} sectionData={sectionData} />;
};
