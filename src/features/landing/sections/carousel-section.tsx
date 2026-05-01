// wherever CarouselSection is used in your landing page
import { client } from "@/lib/orpc";
import { CarouselClient } from "./carousel-client";

export const CarouselSection = async () => {
  const carouselImages = await client.carousel.list();
  return <CarouselClient images={carouselImages} />;
};
