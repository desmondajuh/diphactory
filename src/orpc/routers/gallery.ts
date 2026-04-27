// features/gallery/server/gallery.router.ts
import { ORPCError } from "@orpc/server";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "@/orpc/base";
import {
  gallery,
  galleryInsertSchema,
  galleryUpdateSchema,
} from "@/lib/db/schema";
import { utapi } from "@/lib/uploadthing";

const list = publicProcedure.handler(async ({ context }) => {
  const { db } = context;
  return db.query.gallery.findMany({
    orderBy: (g, { desc }) => [desc(g.createdAt)],
  });
});

const listByCategory = publicProcedure
  .input(z.object({ category: z.string() }))
  .handler(async ({ input, context }) => {
    const { db } = context;
    return db.query.gallery.findMany({
      where: (g, { eq }) => eq(g.category, input.category),
      orderBy: (g, { desc }) => [desc(g.createdAt)],
    });
  });

const getById = publicProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db } = context;
    const image = await db.query.gallery.findFirst({
      where: (g, { eq }) => eq(g.id, input.id),
    });
    if (!image)
      throw new ORPCError("NOT_FOUND", { message: "Image not found" });
    return image;
  });

const create = protectedProcedure
  .input(
    galleryInsertSchema.omit({ uploadedById: true, id: true, createdAt: true }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN", {
        message: "Only admins can upload images",
      });
    }

    const [created] = await db
      .insert(gallery)
      .values({ ...input, uploadedById: user.id })
      .returning();

    return created;
  });

const update = protectedProcedure
  .input(galleryUpdateSchema.required({ id: true }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN", {
        message: "Only admins can update images",
      });
    }

    const { id, ...data } = input;

    const [updated] = await db
      .update(gallery)
      .set(data)
      .where(eq(gallery.id, id))
      .returning();

    if (!updated)
      throw new ORPCError("NOT_FOUND", { message: "Image not found" });

    return updated;
  });

const remove = protectedProcedure
  .input(z.object({ id: z.string().uuid(), utKey: z.string() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN", {
        message: "Only admins can delete images",
      });
    }

    const image = await db.query.gallery.findFirst({
      where: eq(gallery.id, input.id),
    });

    if (!image) {
      throw new ORPCError("NOT_FOUND", { message: "Image not found" });
    }

    await utapi.deleteFiles(image.utKey);
    await db.delete(gallery).where(eq(gallery.id, input.id));

    return { success: true, utKey: input.utKey };
  });

export const galleryRouter = {
  list,
  listByCategory,
  getById,
  create,
  update,
  remove,
};
