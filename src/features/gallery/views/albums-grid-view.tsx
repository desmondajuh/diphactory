// features/gallery/views/albums-grid-view.tsx
import Link from "next/link";
import NextImage from "next/image";
import { Album } from "@/lib/db/schema/albums";

type AlbumWithCover = Album & {
  images: { utUrl: string; blurDataUrl: string | null }[];
};

export function AlbumsGridView({ albums }: { albums: AlbumWithCover[] }) {
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {albums.map((album) => {
          const cover = album.images[0];
          return (
            <Link
              key={album.id}
              href={`/gallery/${album.slug}`}
              className="group relative aspect-4/3 overflow-hidden rounded-2xl border border-white/8 bg-white/3 block"
            >
              {cover && (
                <NextImage
                  src={cover.utUrl}
                  alt={album.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  placeholder={cover.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={cover.blurDataUrl ?? undefined}
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-lg font-black text-white">{album.title}</p>
                {album.shootDate && (
                  <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">
                    {new Date(album.shootDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
