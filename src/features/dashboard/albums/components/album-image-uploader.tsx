"use client";

import { useRef, useState } from "react";
import {
  CheckCircle2Icon,
  LoaderCircleIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing-client";

interface AlbumImageUploaderProps {
  onUploaded: (imageIds: string[]) => Promise<void>;
}

export function AlbumImageUploader({
  onUploaded,
}: AlbumImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("shootPhotoUploader", {
    uploadProgressGranularity: "fine",
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  function setFiles(files: FileList | File[]) {
    const nextFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    setSelectedFiles(nextFiles);
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) {
      toast.error("Choose one or more images first.");
      return;
    }

    setUploadProgress(0);

    try {
      const uploaded = await startUpload(selectedFiles);
      const imageIds =
        uploaded
          ?.map((file) => file.serverData?.imageId)
          .filter((value): value is string => Boolean(value)) ?? [];

      if (imageIds.length === 0) {
        toast.error("The upload finished, but no images were returned.");
        return;
      }

      await onUploaded(imageIds);
      setSelectedFiles([]);
      setUploadProgress(100);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Upload failed.",
      );
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files) {
            setFiles(event.target.files);
          }
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={() => setIsDragging(true)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          setFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed px-6 py-10 text-center transition",
          isDragging
            ? "border-foreground/40 bg-background"
            : "border-border/70 bg-muted/20 hover:border-foreground/25 hover:bg-muted/30",
        )}
      >
        <div className="mb-3 rounded-2xl border border-border/70 bg-background/80 p-3">
          <UploadCloudIcon className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">
          {selectedFiles.length > 0
            ? `${selectedFiles.length} image${selectedFiles.length === 1 ? "" : "s"} selected`
            : "Drop shoot images here or click to browse"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          JPG, PNG, and other image formats are accepted. Up to 50 images per
          batch.
        </p>
      </button>

      {selectedFiles.length > 0 ? (
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Ready to upload</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFiles([]);
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
            >
              <XIcon className="size-4" />
              Clear
            </Button>
          </div>

          <div className="space-y-2">
            {selectedFiles.slice(0, 5).map((file) => (
              <div
                key={`${file.name}-${file.lastModified}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-sm"
              >
                <span className="truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            ))}
            {selectedFiles.length > 5 ? (
              <p className="text-xs text-muted-foreground">
                And {selectedFiles.length - 5} more image
                {selectedFiles.length - 5 === 1 ? "" : "s"}.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {(isUploading || uploadProgress > 0) && (
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span>{isUploading ? "Uploading images" : "Upload complete"}</span>
            <span className="text-muted-foreground">{uploadProgress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-background/80">
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <Button
        type="button"
        disabled={selectedFiles.length === 0 || isUploading}
        onClick={() => void handleUpload()}
      >
        {isUploading ? (
          <>
            <LoaderCircleIcon className="size-4 animate-spin" />
            Uploading
          </>
        ) : uploadProgress === 100 && selectedFiles.length === 0 ? (
          <>
            <CheckCircle2Icon className="size-4" />
            Uploaded
          </>
        ) : (
          <>
            <UploadCloudIcon className="size-4" />
            Upload into album
          </>
        )}
      </Button>
    </div>
  );
}
