// app/(dashboard)/admin/gallery/page.tsx
import { client } from "@/lib/orpc";
import { GalleryAdminView } from "@/features/gallery/views/gallery-admin-view";

export default async function GalleryAdminPage() {
  const images = await client.gallery.list();
  return <GalleryAdminView initialImages={images} />;
}
