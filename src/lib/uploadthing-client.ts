// src/lib/uploadthing-client.ts
// Safe to import in client components
import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Pre-typed components — use these instead of raw @uploadthing/react imports
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// useUploadThing hook — for custom upload UI
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
