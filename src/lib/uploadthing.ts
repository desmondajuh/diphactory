// src/lib/uploadthing.ts
// Server-only — never import this in client components
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

// "use client";

// import {
//   generateUploadButton,
//   generateUploadDropzone,
//   generateReactHelpers,
// } from "@uploadthing/react";

// import type { OurFileRouter } from "@/app/api/uploadthing/core";

// export const UploadButton = generateUploadButton<OurFileRouter>();
// export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
// export const { useUploadThing, uploadFiles } =
//   generateReactHelpers<OurFileRouter>();
