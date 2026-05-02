import { getPlaiceholder } from "plaiceholder";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth, getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { images } from "@/lib/db/schema";
import { requireMinRoleUploadThing } from "@/lib/auth/adapters";

const f = createUploadthing();

async function requirePhotographer() {
  const session = await getSession();

  if (!session?.user) {
    throw new UploadThingError("Unauthorized");
  }

  if (session.user.role !== "photographer") {
    throw new UploadThingError("Only photographers can upload");
  }

  return session.user;
}

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  if (session.user.role !== "admin" && session.user.role !== "super_admin") {
    throw new Error("Forbidden");
  }

  return session.user;
}

export const ourFileRouter = {
  // album image uploader
  shootPhotoUploader: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 50,
    },
  })
    .middleware(async () => {
      // const user = await requirePhotographer();
      const user = await requireMinRoleUploadThing("photographer");
      return { uploadedById: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      let blurDataUrl: string | undefined;

      try {
        const response = await fetch(file.ufsUrl);
        const buffer = Buffer.from(await response.arrayBuffer());
        const { base64 } = await getPlaiceholder(buffer);
        blurDataUrl = base64;
      } catch {
        blurDataUrl = undefined;
      }

      const [image] = await db
        .insert(images)
        .values({
          uploadedById: metadata.uploadedById,
          utKey: file.key,
          utUrl: file.ufsUrl,
          filename: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          blurDataUrl,
        })
        .returning();

      return { imageId: image.id, url: file.ufsUrl };
    }),

  // photographer avatar uploader
  photographerAvatar: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await requirePhotographer();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),

  // image gallery uploader
  galleryUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async () => {
      const user = await requireAdmin();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.ufsUrl, key: file.key, name: file.name };
    }),

  // simple image upload route
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await requireMinRoleUploadThing("photographer");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
