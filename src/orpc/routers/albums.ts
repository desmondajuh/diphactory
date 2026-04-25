import { ORPCError } from "@orpc/server";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  clientProcedure,
  protectedProcedure,
  publicProcedure,
  photographerProcedure,
} from "@/orpc/base";
import { albumImages, albums, clients, images } from "@/lib/db/schema";
import { utapi } from "@/lib/uploadthing";
import { slugify } from "@/utils/slugify";

async function getManageableAlbum(
  db: typeof import("@/lib/db").db,
  {
    albumId,
    userId,
    role,
  }: {
    albumId: string;
    userId: string;
    role: string;
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

const list = photographerProcedure
  .input(
    z
      .object({
        clientId: z.string().uuid().optional(),
      })
      .optional(),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    return db.query.albums.findMany({
      where: and(
        eq(albums.ownerId, user.id),
        eq(albums.type, "shoot"),
        input?.clientId ? eq(albums.clientId, input.clientId) : undefined,
      ),
      with: {
        albumImages: { columns: { imageId: true }, limit: 1 },
        clientRecord: { columns: { name: true, email: true } },
      },
      orderBy: desc(albums.createdAt),
    });
  });

const create = photographerProcedure
  .input(
    z.object({
      title: z.string().min(1).max(100),
      clientId: z.string().uuid().optional(),
      visibility: z.enum(["public", "private"]).default("private"),
      shootDate: z.date().optional(),
      description: z.string().max(500).optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    const baseSlug = slugify(input.title);
    const slug = `${baseSlug}-${nanoid(6)}`;

    if (input.clientId) {
      const client = await db.query.clients.findFirst({
        where: and(
          eq(clients.id, input.clientId),
          eq(clients.photographerId, user.id),
        ),
      });

      if (!client) {
        throw new ORPCError("FORBIDDEN", {
          message: "You can only create albums for your own clients",
        });
      }
    }

    const plainCode =
      input.visibility === "private" ? nanoid(6).toUpperCase() : null;
    const accessCode = plainCode ? await hash(plainCode, 10) : null;

    const [album] = await db
      .insert(albums)
      .values({
        ownerId: user.id,
        clientId: input.clientId,
        title: input.title,
        slug,
        type: "shoot",
        visibility: input.visibility,
        accessCode,
        accessCodePlain: plainCode,
        shootDate: input.shootDate,
        description: input.description,
      })
      .returning();

    return { ...album, plainCode };
  });

const getById = protectedProcedure
  .input(z.object({ albumId: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    if (
      user.role !== "photographer" &&
      user.role !== "admin" &&
      user.role !== "super_admin"
    ) {
      throw new ORPCError("FORBIDDEN", {
        message: "You do not have access to manage albums",
      });
    }

    const album = await db.query.albums.findFirst({
      where:
        user.role === "photographer"
          ? and(eq(albums.id, input.albumId), eq(albums.ownerId, user.id))
          : eq(albums.id, input.albumId),
      with: {
        clientRecord: true,
        albumImages: {
          with: {
            image: true,
          },
          orderBy: (albumImage, { asc }) => [asc(albumImage.sortOrder)],
        },
      },
    });

    if (!album) {
      throw new ORPCError("NOT_FOUND");
    }

    return album;
  });

const update = photographerProcedure
  .input(
    z.object({
      albumId: z.string().uuid(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      visibility: z.enum(["public", "private"]).optional(),
      isActive: z.boolean().optional(),
      expiresAt: z.date().nullable().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    const existing = await db.query.albums.findFirst({
      where: and(eq(albums.id, input.albumId), eq(albums.ownerId, user.id)),
    });

    if (!existing) {
      throw new ORPCError("NOT_FOUND");
    }

    const nextVisibility = input.visibility ?? existing.visibility;
    const nextAccessCode =
      nextVisibility === "public"
        ? null
        : existing.accessCode ??
          (await hash(nanoid(6).toUpperCase(), 10));

    const { albumId, ...rest } = input;
    const [updated] = await db
      .update(albums)
      .set({
        ...rest,
        accessCode: nextAccessCode,
        accessCodePlain:
          nextVisibility === "public" ? null : existing.accessCodePlain,
        updatedAt: new Date(),
      })
      .where(eq(albums.id, albumId))
      .returning();

    return updated;
  });

const deleteAlbum = photographerProcedure
  .input(z.object({ albumId: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    const existing = await db.query.albums.findFirst({
      where: and(eq(albums.id, input.albumId), eq(albums.ownerId, user.id)),
      with: { albumImages: { with: { image: true } } },
    });

    if (!existing) {
      throw new ORPCError("NOT_FOUND");
    }

    const imageIds = existing.albumImages.map((albumImage) => albumImage.imageId);

    const removableImageIds: string[] = [];
    const removableUtKeys: string[] = [];

    for (const albumImage of existing.albumImages) {
      const [{ value: usageCount }] = await db
        .select({ value: count() })
        .from(albumImages)
        .where(eq(albumImages.imageId, albumImage.imageId));

      if (usageCount === 1) {
        removableImageIds.push(albumImage.imageId);
        removableUtKeys.push(albumImage.image.utKey);
      }
    }

    await db.delete(albums).where(eq(albums.id, input.albumId));

    if (removableUtKeys.length > 0) {
      await utapi.deleteFiles(removableUtKeys);
    }

    if (removableImageIds.length > 0) {
      await db.delete(images).where(inArray(images.id, removableImageIds));
    }

    return {
      success: true,
      deletedImages: imageIds.length,
      removedAssets: removableImageIds.length,
    };
  });

const regenerateCode = protectedProcedure
  .input(z.object({ albumId: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    if (
      user.role !== "photographer" &&
      user.role !== "admin" &&
      user.role !== "super_admin"
    ) {
      throw new ORPCError("FORBIDDEN", {
        message: "You do not have access to manage private album codes",
      });
    }

    const existing = await getManageableAlbum(db, {
      albumId: input.albumId,
      userId: user.id,
      role: user.role,
    });

    if (existing.visibility !== "private") {
      throw new ORPCError("BAD_REQUEST", {
        message: "Only private albums have access codes",
      });
    }

    const plainCode = nanoid(6).toUpperCase();

    await db
      .update(albums)
      .set({
        accessCode: await hash(plainCode, 10),
        accessCodePlain: plainCode,
        updatedAt: new Date(),
      })
      .where(eq(albums.id, input.albumId));

    return { plainCode };
  });

const createCollection = clientProcedure
  .input(z.object({ title: z.string().min(1).max(80) }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    const [{ value: existing }] = await db
      .select({ value: count() })
      .from(albums)
      .where(
        and(
          eq(albums.collectionOwnerId, user.id),
          eq(albums.type, "collection"),
        ),
      );

    if (existing >= 3) {
      throw new ORPCError("FORBIDDEN", {
        message: "You have reached the maximum of 3 collections",
      });
    }

    const slug = `${slugify(input.title)}-${nanoid(6)}`;
    const [album] = await db
      .insert(albums)
      .values({
        ownerId: user.id,
        collectionOwnerId: user.id,
        title: input.title,
        slug,
        type: "collection",
        visibility: "private",
      })
      .returning();

    return album;
  });

const getSharedBySlug = publicProcedure
  .input(z.object({ slug: z.string().min(1) }))
  .handler(async ({ input, context }) => {
    const { db } = context;

    const album = await db.query.albums.findFirst({
      where: and(eq(albums.slug, input.slug), eq(albums.isActive, true)),
      with: {
        clientRecord: {
          columns: {
            name: true,
          },
        },
        albumImages: {
          columns: {
            imageId: true,
          },
          limit: 4,
        },
      },
    });

    if (!album) {
      throw new ORPCError("NOT_FOUND");
    }

    return {
      id: album.id,
      slug: album.slug,
      title: album.title,
      description: album.description,
      visibility: album.visibility,
      type: album.type,
      expiresAt: album.expiresAt,
      clientName: album.clientRecord?.name ?? null,
      previewCount: album.albumImages.length,
    };
  });

export const albumsRouter = {
  list,
  create,
  getById,
  update,
  delete: deleteAlbum,
  regenerateCode,
  createCollection,
  getSharedBySlug,
};
