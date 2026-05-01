// orpc/routers/carousel.ts
import { ORPCError } from "@orpc/server";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "@/orpc/base";
import { carouselImages } from "@/lib/db/schema";
import { utapi } from "@/lib/uploadthing";

const list = publicProcedure.handler(async ({ context }) => {
  const { db } = context;
  return db.query.carouselImages.findMany({
    where: (c, { eq }) => eq(c.isActive, true),
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
  });
});

const listAll = protectedProcedure.handler(async ({ context }) => {
  const { db, user } = context;
  if (user.role !== "admin" && user.role !== "super_admin") {
    throw new ORPCError("FORBIDDEN");
  }
  return db.query.carouselImages.findMany({
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
  });
});

const upsertSlot = protectedProcedure
  .input(
    z.object({
      id: z.string().uuid().optional(),
      src: z.string(),
      alt: z.string(),
      utKey: z.string().optional().nullable(),
      sortOrder: z.number().int(),
      isActive: z.boolean().default(true),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN");
    }

    if (input.id) {
      const [updated] = await db
        .update(carouselImages)
        .set({
          src: input.src,
          alt: input.alt,
          utKey: input.utKey,
          isActive: input.isActive,
        })
        .where(eq(carouselImages.id, input.id))
        .returning();
      return updated;
    }

    const [created] = await db.insert(carouselImages).values(input).returning();
    return created;
  });

const remove = protectedProcedure
  .input(z.object({ id: z.string().uuid(), utKey: z.string().nullable() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN");
    }
    if (input.utKey) await utapi.deleteFiles(input.utKey);
    await db.delete(carouselImages).where(eq(carouselImages.id, input.id));
    return { success: true };
  });

const toggleActive = protectedProcedure
  .input(z.object({ id: z.string().uuid(), isActive: z.boolean() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN");
    }
    const [updated] = await db
      .update(carouselImages)
      .set({ isActive: input.isActive })
      .where(eq(carouselImages.id, input.id))
      .returning();
    return updated;
  });

export const carouselRouter = {
  list,
  listAll,
  upsertSlot,
  remove,
  toggleActive,
};
