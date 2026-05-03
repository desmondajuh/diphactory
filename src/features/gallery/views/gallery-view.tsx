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
      <div className="max-w-5xl mx-auto text-center mb-16">
        <p className="text-accent-red text-xs uppercase tracking-[0.22em] font-semibold mb-3">
          Portfolio
        </p>
        <h1
          className="font-black text-white leading-none"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        >
          Our Work<span className="text-accent-red">*</span>
        </h1>
        <p className="text-white/40 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
          Every frame tells a story. Browse our collection of portraits,
          weddings, and commercial work.
        </p>
      </div>

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
