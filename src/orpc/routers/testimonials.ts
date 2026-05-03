import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "@/orpc/base";
import { testimonials, insertTestimonialSchema } from "@/lib/db/schema";
import { utapi } from "@/lib/uploadthing";

// Public - only published testimonials
const list = publicProcedure.handler(async ({ context }) => {
  const { db } = context;

  return db.query.testimonials.findMany({
    where: (t, { eq }) => eq(t.isPublished, true),
    orderBy: (t, { asc }) => [asc(t.sortOrder)],
  });
});

// Admin - all testimonials including unpublished
const listAll = protectedProcedure.handler(async ({ context }) => {
  const { db, user } = context;

  if (user.role !== "admin" && user.role !== "super_admin") {
    throw new ORPCError("FORBIDDEN", {
      message: "Only admins can view all testimonials",
    });
  }

  return db.query.testimonials.findMany({
    orderBy: (t, { asc }) => [asc(t.sortOrder)],
  });
});

// Admin - create
const create = protectedProcedure
  .input(insertTestimonialSchema)
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN", {
        message: "Only admins can create testimonials",
      });
    }

    const [created] = await db.insert(testimonials).values(input).returning();

    return created;
  });

// Admin - update
const update = protectedProcedure
  .input(insertTestimonialSchema.partial().extend({ id: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN", {
        message: "Only admins can update testimonials",
      });
    }

    const { id, ...data } = input;

    const existing = await db.query.testimonials.findFirst({
      where: eq(testimonials.id, id),
    });
    if (!existing)
      throw new ORPCError("NOT_FOUND", { message: "Testimonial not found" });

    // delete old image from UT if replaced
    if (
      data.clientImageUtKey &&
      existing.clientImageUtKey &&
      data.clientImageUtKey !== existing.clientImageUtKey
    ) {
      await utapi.deleteFiles(existing.clientImageUtKey);
    }

    const [updated] = await db
      .update(testimonials)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning();

    if (!updated)
      throw new ORPCError("NOT_FOUND", { message: "Testimonial not found" });

    return updated;
  });

// Admin - delete
const remove = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN", {
        message: "Only admins can delete testimonials",
      });
    }

    const existing = await db.query.testimonials.findFirst({
      where: eq(testimonials.id, input.id),
    });

    if (!existing) throw new ORPCError("NOT_FOUND");

    await db.delete(testimonials).where(eq(testimonials.id, input.id));

    if (existing.clientImageUtKey) {
      await utapi.deleteFiles(existing.clientImageUtKey);
    }

    return { success: true };
  });

// Admin - toggle published
const togglePublished = protectedProcedure
  .input(z.object({ id: z.string().uuid(), isPublished: z.boolean() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN", {
        message: "Only admins can publish testimonials",
      });
    }

    const [updated] = await db
      .update(testimonials)
      .set({ isPublished: input.isPublished, updatedAt: new Date() })
      .where(eq(testimonials.id, input.id))
      .returning();

    return updated;
  });

export const testimonialsRouter = {
  list,
  listAll,
  create,
  update,
  remove,
  togglePublished,
};
