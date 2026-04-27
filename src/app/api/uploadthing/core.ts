import { getPlaiceholder } from "plaiceholder";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth, getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { images } from "@/lib/db/schema";

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
  shootPhotoUploader: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 50,
    },
  })
    .middleware(async () => {
      const user = await requirePhotographer();
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

  galleryUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async () => {
      const user = await requirePhotographer();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.ufsUrl, key: file.key, name: file.name };
    }),

  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user) {
        throw new UploadThingError(
          "You must be signed in to upload product images.",
        );
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),

  swatchUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user) {
        throw new UploadThingError(
          "You must be signed in to upload product images.",
        );
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Swatch uploaded:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
