// features/gallery/components/gallery-upload-modal.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing-client";
import { client } from "@/lib/orpc";
import { cn } from "@/lib/utils";

interface Props {
  onClose: () => void;
  onUploaded: () => void;
}

export function GalleryUploadModal({ onClose, onUploaded }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("galleryUploader");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setIsUploading(true);

    try {
      const results = await startUpload(files);
      if (!results) throw new Error("Upload failed");

      await Promise.all(
        results.map((res, i) =>
          client.gallery.create({
            utKey: res.key,
            utUrl: res.ufsUrl,
            filename: files[i].name,
            mimeType: files[i].type,
            sizeBytes: files[i].size,
            category: category || null,
          }),
        ),
      );

      toast.success(
        `${results.length} image${results.length > 1 ? "s" : ""} uploaded`,
      );
      onUploaded();
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e0e0e] p-6 space-y-5">
        <p className="text-base font-semibold text-white">Upload images</p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-all duration-200 cursor-pointer",
            isDragging
              ? "border-white/40 bg-white/8"
              : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5",
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="text-white/25"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <p className="text-sm text-white/40">
            Drop images here or{" "}
            <span className="text-white/70 underline">browse</span>
          </p>
          <p className="text-xs text-white/20">
            Up to 10 images · Max 8MB each
          </p>
        </div>

        {/* Selected files */}
        {files.length > 0 && (
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
              >
                <span className="text-xs text-white/60 truncate">{f.name}</span>
                <button
                  onClick={() =>
                    setFiles((prev) => prev.filter((_, j) => j !== i))
                  }
                  className="text-white/20 hover:text-white/60 ml-2 shrink-0 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Category
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Wedding, Portrait, Commercial"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-white/20"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="rounded-full border border-white/12 px-5 py-2 text-sm font-medium text-white/50 hover:text-white hover:border-white/25 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!files.length || isUploading}
            className="rounded-full bg-white px-6 py-2 text-sm font-bold text-[#0e0e0e] hover:bg-white/90 disabled:opacity-40 transition-all"
          >
            {isUploading ? "Uploading..." : `Upload ${files.length || ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
