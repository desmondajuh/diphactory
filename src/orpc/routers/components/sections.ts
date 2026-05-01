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
      statItems: z.array(statItemSchema).optional(),
      featureItems: z.array(featureItemSchema).optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (user.role !== "admin" && user.role !== "super_admin")
      throw new ORPCError("FORBIDDEN");

    const { id, statItems: stats, featureItems: features, ...data } = input;

    const [updated] = await db
      .update(sections)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sections.id, id))
      .returning();

    if (!updated) throw new ORPCError("NOT_FOUND");

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
      await db.delete(featureItems).where(eq(featureItems.sectionId, id));
      if (features.length) {
        await db
          .insert(featureItems)
          .values(features.map((f) => ({ ...f, sectionId: id })));
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

    await db.delete(sections).where(eq(sections.id, input.id));
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
