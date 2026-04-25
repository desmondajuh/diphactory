import { ORPCError } from "@orpc/server";
import { and, count, eq, or } from "drizzle-orm";
import { z } from "zod";
import {
  clientProcedure,
  protectedProcedure,
  photographerProcedure,
  publicProcedure,
} from "@/orpc/base";
import { albumAccesses, albumImages, albums, images } from "@/lib/db/schema";
import { utapi } from "@/lib/uploadthing";

async function getManageableAlbum(
  db: typeof import("@/lib/db").db,
  {
    albumId,
    userId,
    role,
  }: {
    albumId: string;
    userId: string;
    role?: string | null;
  },
) {
  const album = await db.query.albums.findFirst({
    where:
      role === "photographer"
        ? and(eq(albums.id, albumId), eq(albums.ownerId, userId))
        : eq(albums.id, albumId),
  });

  if (!album) {
    throw new ORPCError("NOT_FOUND");
  }

  return album;
}

const listByAlbum = protectedProcedure
  .input(z.object({ albumId: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    if (
      user.role !== "photographer" &&
      user.role !== "admin" &&
      user.role !== "super_admin"
    ) {
      throw new ORPCError("FORBIDDEN", {
        message: "You do not have access to manage album images",
      });
    }

    await getManageableAlbum(db, {
      albumId: input.albumId,
      userId: user.id,
      role: user.role,
    });

    return db.query.albumImages.findMany({
      where: eq(albumImages.albumId, input.albumId),
      with: { image: true },
      orderBy: (albumImage, { asc }) => [
        asc(albumImage.sortOrder),
        asc(albumImage.addedAt),
      ],
    });
  });

const addToAlbum = photographerProcedure
  .input(
    z.object({
      albumId: z.string().uuid(),
      imageIds: z.array(z.string().uuid()).min(1).max(50),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    await getManageableAlbum(db, {
      albumId: input.albumId,
      userId: user.id,
      role: user.role,
    });

    const ownedImages = await db.query.images.findMany({
      where: eq(images.uploadedById, user.id),
      columns: { id: true },
    });
    const ownedImageIds = new Set(ownedImages.map((image) => image.id));

    const unauthorizedImageId = input.imageIds.find(
      (imageId) => !ownedImageIds.has(imageId),
    );
    if (unauthorizedImageId) {
      throw new ORPCError("FORBIDDEN", {
        message: "You can only add images you uploaded",
      });
    }

    const [{ value: existingCount }] = await db
      .select({ value: count() })
      .from(albumImages)
      .where(eq(albumImages.albumId, input.albumId));

    await db
      .insert(albumImages)
      .values(
        input.imageIds.map((imageId, index) => ({
          albumId: input.albumId,
          imageId,
          sortOrder: existingCount + index,
        })),
      )
      .onConflictDoNothing();

    return { added: input.imageIds.length };
  });

const addToCollection = clientProcedure
  .input(
    z.object({
      collectionId: z.string().uuid(),
      imageId: z.string().uuid(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    const collection = await db.query.albums.findFirst({
      where: and(
        eq(albums.id, input.collectionId),
        eq(albums.collectionOwnerId, user.id),
        eq(albums.type, "collection"),
      ),
    });

    if (!collection) {
      throw new ORPCError("NOT_FOUND");
    }

    const matchingAlbumImage = await db.query.albumImages.findFirst({
      where: eq(albumImages.imageId, input.imageId),
      with: {
        album: true,
      },
    });

    if (!matchingAlbumImage) {
      throw new ORPCError("NOT_FOUND");
    }

    const accessForAlbum = await db.query.albumAccesses.findFirst({
      where: and(
        eq(albumAccesses.albumId, matchingAlbumImage.albumId),
        or(
          eq(albumAccesses.userId, user.id),
          eq(albumAccesses.visitorEmail, user.email.toLowerCase()),
        ),
      ),
    });

    if (!accessForAlbum || !matchingAlbumImage.album.isActive) {
      throw new ORPCError("FORBIDDEN", {
        message: "You can only save images from albums you can access",
      });
    }

    await db
      .insert(albumImages)
      .values({
        albumId: input.collectionId,
        imageId: input.imageId,
        sortOrder: 0,
      })
      .onConflictDoNothing();

    return { success: true };
  });

const deleteImage = photographerProcedure
  .input(z.object({ imageId: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    const image = await db.query.images.findFirst({
      where: eq(images.id, input.imageId),
    });

    if (!image) {
      throw new ORPCError("NOT_FOUND");
    }

    if (image.uploadedById !== user.id) {
      throw new ORPCError("FORBIDDEN");
    }

    await utapi.deleteFiles(image.utKey);
    await db.delete(images).where(eq(images.id, input.imageId));

    return { success: true };
  });

const removeFromAlbum = protectedProcedure
  .input(
    z.object({
      albumId: z.string().uuid(),
      imageId: z.string().uuid(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    if (
      user.role !== "photographer" &&
      user.role !== "admin" &&
      user.role !== "super_admin"
    ) {
      throw new ORPCError("FORBIDDEN", {
        message: "You do not have access to manage album images",
      });
    }

    await getManageableAlbum(db, {
      albumId: input.albumId,
      userId: user.id,
      role: user.role,
    });

    const albumImage = await db.query.albumImages.findFirst({
      where: and(
        eq(albumImages.albumId, input.albumId),
        eq(albumImages.imageId, input.imageId),
      ),
      with: {
        image: true,
      },
    });

    if (!albumImage) {
      throw new ORPCError("NOT_FOUND", {
        message: "This image is not attached to the album",
      });
    }

    if (
      user.role === "photographer" &&
      albumImage.image.uploadedById !== user.id
    ) {
      throw new ORPCError("FORBIDDEN", {
        message: "You can only manage images you uploaded",
      });
    }

    await db
      .delete(albumImages)
      .where(
        and(
          eq(albumImages.albumId, input.albumId),
          eq(albumImages.imageId, input.imageId),
        ),
      );

    const [{ value: remainingUsageCount }] = await db
      .select({ value: count() })
      .from(albumImages)
      .where(eq(albumImages.imageId, input.imageId));

    if (remainingUsageCount === 0) {
      await utapi.deleteFiles(albumImage.image.utKey);
      await db.delete(images).where(eq(images.id, input.imageId));
    }

    return { success: true, deletedAsset: remainingUsageCount === 0 };
  });

const reorder = photographerProcedure
  .input(
    z.object({
      albumId: z.string().uuid(),
      orderedIds: z.array(z.string().uuid()),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    const album = await db.query.albums.findFirst({
      where: and(eq(albums.id, input.albumId), eq(albums.ownerId, user.id)),
    });

    if (!album) {
      throw new ORPCError("NOT_FOUND");
    }

    await db.transaction(async (tx) => {
      for (let index = 0; index < input.orderedIds.length; index += 1) {
        await tx
          .update(albumImages)
          .set({ sortOrder: index })
          .where(
            and(
              eq(albumImages.albumId, input.albumId),
              eq(albumImages.imageId, input.orderedIds[index]),
            ),
          );
      }
    });

    return { success: true };
  });

const listAccessibleAlbum = publicProcedure
  .input(
    z.object({
      slug: z.string().min(1),
      accessId: z.string().uuid(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db } = context;

    const album = await db.query.albums.findFirst({
      where: and(eq(albums.slug, input.slug), eq(albums.isActive, true)),
    });

    if (!album) {
      throw new ORPCError("NOT_FOUND");
    }

    if (album.expiresAt && album.expiresAt < new Date()) {
      throw new ORPCError("FORBIDDEN", {
        message: "This album is no longer available",
      });
    }

    const access = await db.query.albumAccesses.findFirst({
      where: and(
        eq(albumAccesses.id, input.accessId),
        eq(albumAccesses.albumId, album.id),
      ),
    });

    if (!access) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Please unlock or enter this album first",
      });
    }

    const items = await db.query.albumImages.findMany({
      where: eq(albumImages.albumId, album.id),
      with: {
        image: true,
      },
      orderBy: (albumImage, { asc }) => [asc(albumImage.sortOrder)],
    });

    return {
      album: {
        id: album.id,
        title: album.title,
        slug: album.slug,
        description: album.description,
        visibility: album.visibility,
      },
      access: {
        id: access.id,
        visitorEmail: access.visitorEmail,
      },
      items,
    };
  });

export const imagesRouter = {
  listByAlbum,
  addToAlbum,
  addToCollection,
  deleteImage,
  removeFromAlbum,
  reorder,
  listAccessibleAlbum,
};
