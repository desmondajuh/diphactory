// app/(public)/gallery/[slug]/page.tsx
import { notFound } from "next/navigation";
import { client } from "@/lib/orpc";
import { AlbumView } from "@/features/gallery/views/album-view";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = await client.albums.getPublicBySlug({ slug }).catch(() => null);
  if (!album) notFound();

  return <AlbumView album={album} />;
}
