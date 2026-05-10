// features/gallery/views/gallery-view.tsx
import { client } from "@/lib/orpc";
import { GalleryGrid } from "../components/gallery-grid";
import { SectionHeader } from "@/components/shared/section-header";

export default async function GalleryView() {
  // const images = await client.gallery.list();

  const [galleryHeroData, images, albums] = await Promise.all([
    client.sections.getBySlug({ slug: "gallery-header" }),
    client.gallery.list(),
    client.albums.listPublicGallery(),
  ]);

  // build albumId → slug lookup map
  const albumSlugs = Object.fromEntries(albums.map((a) => [a.id, a.slug]));

  const categories = [
    "All",
    ...new Set(images.map((i) => i.category).filter(Boolean)),
  ] as string[];

  return (
    <section className="min-h-screen bg-[#0e0e0e] px-6 py-24">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <SectionHeader
        variant="center"
        badge={galleryHeroData?.badge || "Portfolio"}
        title={galleryHeroData?.title || "Our Work"}
        subtitle={
          galleryHeroData?.subtitle ||
          "Every frame tells a story. Browse our collection of portraits, weddings, and commercial work."
        }
      />

      <GalleryGrid
        images={images}
        categories={categories}
        albumSlugs={albumSlugs}
      />
    </section>
  );
}
