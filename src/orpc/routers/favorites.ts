import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure } from "@/orpc/base";
import { albumAccesses, albumImages, favorites } from "@/lib/db/schema";

const list = publicProcedure
  .input(z.object({ accessId: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db } = context;

    return db.query.favorites.findMany({
      where: eq(favorites.albumAccessId, input.accessId),
      with: {
        image: { columns: { id: true, utUrl: true, blurDataUrl: true } },
      },
      orderBy: (favorite, { asc }) => [asc(favorite.createdAt)],
    });
  });

const toggle = publicProcedure
  .input(
    z.object({
      accessId: z.string().uuid(),
      imageId: z.string().uuid(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db } = context;

    const access = await db.query.albumAccesses.findFirst({
      where: eq(albumAccesses.id, input.accessId),
    });

    if (!access) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const albumImage = await db.query.albumImages.findFirst({
      where: and(
        eq(albumImages.albumId, access.albumId),
        eq(albumImages.imageId, input.imageId),
      ),
    });

    if (!albumImage) {
      throw new ORPCError("FORBIDDEN", {
        message: "You can only favorite images from the unlocked album",
      });
    }

    const existing = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.albumAccessId, input.accessId),
        eq(favorites.imageId, input.imageId),
      ),
    });

    if (existing) {
      await db.delete(favorites).where(eq(favorites.id, existing.id));
      return { favorited: false };
    }

    await db.insert(favorites).values({
      albumAccessId: input.accessId,
      imageId: input.imageId,
    });

    return { favorited: true };
  });

export const favoritesRouter = { list, toggle };
