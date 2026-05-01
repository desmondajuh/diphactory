// features/gallery/views/gallery-admin-view.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/orpc";
import { GALLERY_IMAGE_TYPE } from "@/lib/db/schema";
import { GalleryUploadModal } from "../components/gallery-upload-modal";
import { GalleryEditModal } from "../components/gallery-edit-modal";
import { GalleryDeleteModal } from "../components/gallery-delete-modal";
import { GalleryAdminGrid } from "../components/gallery-admin-grid";
import { AlbumOption } from "@/types/router-types";

interface Props {
  initialImages: GALLERY_IMAGE_TYPE[];
  albums: AlbumOption[];
}

export function GalleryAdminView({ initialImages, albums }: Props) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<GALLERY_IMAGE_TYPE | null>(null);
  const [deleting, setDeleting] = useState<GALLERY_IMAGE_TYPE | null>(null);

  const refresh = async () => {
    const data = await client.gallery.list();
    setImages(data);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await client.gallery.remove({ id: deleting.id, utKey: deleting.utKey });
      toast.success("Image deleted");
      setDeleting(null);
      await refresh();
    } catch {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Gallery</h1>
          <p className="text-sm text-white/35 mt-1">{images.length} images</p>
        </div>
        <button
          onClick={() => setUploading(true)}
          className="rounded-full bg-white text-[#0e0e0e] px-6 py-2.5 text-sm font-bold hover:bg-white/90 transition-all"
        >
          + Upload images
        </button>
      </div>

      <GalleryAdminGrid
        images={images}
        onEdit={setEditing}
        onDelete={setDeleting}
      />

      {uploading && (
        <GalleryUploadModal
          albums={albums}
          onClose={() => setUploading(false)}
          onUploaded={async () => {
            setUploading(false);
            await refresh();
          }}
        />
      )}

      {editing && (
        <GalleryEditModal
          albums={albums}
          image={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await refresh();
          }}
        />
      )}

      {deleting && (
        <GalleryDeleteModal
          image={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
