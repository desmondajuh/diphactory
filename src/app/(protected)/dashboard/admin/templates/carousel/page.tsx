// app/(dashboard)/admin/templates/carousel/page.tsx
import { client } from "@/lib/orpc";
import { CarouselAdminView } from "@/features/admin/views/carousel-admin-view";

export default async function CarouselAdminPage() {
  const images = await client.carousel.listAll();
  return <CarouselAdminView initialImages={images} />;
}
