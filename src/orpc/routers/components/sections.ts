// orpc/routers/sections.ts
import { ORPCError } from "@orpc/server";
import { eq, and, asc } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "@/orpc/base";
import {
  sections,
  statItems,
  featureItems,
  sectionInsertSchema,
  sectionUpdateSchema,
} from "@/lib/db/schema";
import { utapi } from "@/lib/uploadthing";

const statItemSchema = z.object({
  id: z.string().uuid().optional(),
  value: z.string().min(1),
  label: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

const featureItemSchema = z.object({
  id: z.string().uuid().optional(),
  icon: z.string().optional().nullable(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  imageUtKey: z.string().optional().nullable(),
  ctaText: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

// Public — get single section by slug with items
const getBySlug = publicProcedure
  .input(z.object({ slug: z.string() }))
  .handler(async ({ input, context }) => {
    const { db } = context;

    const section = await db.query.sections.findFirst({
      where: (s, { eq, and }) =>
        and(eq(s.slug, input.slug), eq(s.isActive, true)),
      with: {
        statItems: { orderBy: (s, { asc }) => [asc(s.sortOrder)] },
        featureItems: { orderBy: (f, { asc }) => [asc(f.sortOrder)] },
      },
    });

    if (!section) throw new ORPCError("NOT_FOUND");
    return section;
  });

// Public — get all sections for a page
const getByPage = publicProcedure
  .input(z.object({ pageSlug: z.string() }))
  .handler(async ({ input, context }) => {
    const { db } = context;

    return db.query.sections.findMany({
      where: (s, { eq, and }) =>
        and(eq(s.pageSlug, input.pageSlug), eq(s.isActive, true)),
      orderBy: (s, { asc }) => [asc(s.sortOrder)],
      with: {
        statItems: { orderBy: (s, { asc }) => [asc(s.sortOrder)] },
        featureItems: { orderBy: (f, { asc }) => [asc(f.sortOrder)] },
      },
    });
  });

// Admin — list all sections
const listAll = protectedProcedure.handler(async ({ context }) => {
  const { db, user } = context;
  if (user.role !== "admin" && user.role !== "super_admin")
    throw new ORPCError("FORBIDDEN");

  return db.query.sections.findMany({
    orderBy: (s, { asc }) => [asc(s.pageSlug), asc(s.sortOrder)],
    with: {
      statItems: { orderBy: (s, { asc }) => [asc(s.sortOrder)] },
      featureItems: { orderBy: (f, { asc }) => [asc(f.sortOrder)] },
    },
  });
});

// Admin — create section with items
const create = protectedProcedure
  .input(
    sectionInsertSchema
      .omit({ id: true, createdAt: true, updatedAt: true })
      .extend({
        imageUtKey: z.string().optional().nullable(),
        bgImageUtKey: z.string().optional().nullable(),
        statItems: z.array(statItemSchema).optional(),
        featureItems: z.array(featureItemSchema).optional(),
      }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (user.role !== "admin" && user.role !== "super_admin")
      throw new ORPCError("FORBIDDEN");

    const { statItems: stats, featureItems: features, ...sectionData } = input;

    const [section] = await db.insert(sections).values(sectionData).returning();

    if (stats?.length) {
      await db
        .insert(statItems)
        .values(stats.map((s) => ({ ...s, sectionId: section.id })));
    }

    if (features?.length) {
      await db
        .insert(featureItems)
        .values(features.map((f) => ({ ...f, sectionId: section.id })));
    }

    return section;
  });

// Admin — update section and replace items
const update = protectedProcedure
  .input(
    sectionUpdateSchema.required({ id: true }).extend({
      imageUtKey: z.string().optional().nullable(),
      bgImageUtKey: z.string().optional().nullable(),
      statItems: z.array(statItemSchema).optional(),
      featureItems: z.array(featureItemSchema).optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (user.role !== "admin" && user.role !== "super_admin")
      throw new ORPCError("FORBIDDEN");

    const { id, statItems: stats, featureItems: features, ...data } = input;

    // utKey cleanup
    // fetch existing to compare utKeys
    const existing = await db.query.sections.findFirst({
      where: eq(sections.id, id),
    });

    if (!existing) throw new ORPCError("NOT_FOUND");

    // ── Collect stale section-level UT keys ──
    // Only delete if a NEW key is coming in to replace it
    const sectionKeysToDelete: string[] = [];

    if (
      data.imageUtKey &&
      existing.imageUtKey &&
      data.imageUtKey !== existing.imageUtKey
    ) {
      sectionKeysToDelete.push(existing.imageUtKey);
    }

    if (
      data.bgImageUtKey &&
      existing.bgImageUtKey &&
      data.bgImageUtKey !== existing.bgImageUtKey
    ) {
      sectionKeysToDelete.push(existing.bgImageUtKey);
    }

    const [updated] = await db
      .update(sections)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sections.id, id))
      .returning();

    if (!updated) throw new ORPCError("NOT_FOUND");

    // ── Clean up stale section images ──
    if (sectionKeysToDelete.length > 0) {
      await utapi.deleteFiles(sectionKeysToDelete);
    }

    // Replace stat items if provided
    if (stats !== undefined) {
      await db.delete(statItems).where(eq(statItems.sectionId, id));
      if (stats.length) {
        await db
          .insert(statItems)
          .values(stats.map((s) => ({ ...s, sectionId: id })));
      }
    }

    // Replace feature items if provided
    if (features !== undefined) {
      // fetch existing feature items to get their utKeys
      const existingFeatures = await db.query.featureItems.findMany({
        where: eq(featureItems.sectionId, id),
      });

      // ✅ THE FIX — only delete keys that are NOT coming back in the new data
      // incoming keys = keys the client is keeping or replacing with
      const incomingUtKeys = new Set(
        features.map((f) => f.imageUtKey).filter(Boolean),
      );

      // collect keys of items being replaced
      const featureKeysToDelete = existingFeatures
        .map((f) => f.imageUtKey)
        .filter((key): key is string => !!key && !incomingUtKeys.has(key));

      // replace DB records
      await db.delete(featureItems).where(eq(featureItems.sectionId, id));
      if (features.length) {
        await db
          .insert(featureItems)
          .values(features.map((f) => ({ ...f, sectionId: id })));
      }

      // delete old UT files after DB is updated
      // only now delete truly orphaned UT files
      if (featureKeysToDelete.length > 0) {
        await utapi.deleteFiles(featureKeysToDelete);
      }
    }

    return updated;
  });

// Admin — toggle active
const toggleActive = protectedProcedure
  .input(z.object({ id: z.string().uuid(), isActive: z.boolean() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (user.role !== "admin" && user.role !== "super_admin")
      throw new ORPCError("FORBIDDEN");

    const [updated] = await db
      .update(sections)
      .set({ isActive: input.isActive, updatedAt: new Date() })
      .where(eq(sections.id, input.id))
      .returning();

    return updated;
  });

// Admin — delete section (cascade deletes items)
const remove = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (user.role !== "admin" && user.role !== "super_admin")
      throw new ORPCError("FORBIDDEN");

    const existing = await db.query.sections.findFirst({
      where: eq(sections.id, input.id),
    });

    if (!existing) throw new ORPCError("NOT_FOUND");

    const existingFeatures = await db.query.featureItems.findMany({
      where: eq(featureItems.sectionId, input.id),
    });

    const featureImageKeys = existingFeatures
      .map((f) => f.imageUtKey)
      .filter(Boolean) as string[];

    const keysToDelete = [
      existing.imageUtKey,
      existing.bgImageUtKey,
      ...featureImageKeys,
    ].filter(Boolean) as string[];

    // delete DB record first (cascade handles stat/feature items)
    await db.delete(sections).where(eq(sections.id, input.id));

    // clean up UT storage
    if (keysToDelete.length > 0) {
      await utapi.deleteFiles(keysToDelete);
    }

    return { success: true };
  });

export const sectionsRouter = {
  getBySlug,
  getByPage,
  listAll,
  create,
  update,
  toggleActive,
  remove,
};
