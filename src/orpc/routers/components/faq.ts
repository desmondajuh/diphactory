// orpc/routers/faq.ts
import { ORPCError } from "@orpc/server";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "@/orpc/base";
import { faqs } from "@/lib/db/schema";

const list = publicProcedure.handler(async ({ context }) => {
  const { db } = context;
  return db.query.faqs.findMany({
    where: (f, { eq }) => eq(f.isActive, true),
    orderBy: (f, { asc }) => [asc(f.sortOrder)],
  });
});

const listAll = protectedProcedure.handler(async ({ context }) => {
  const { db, user } = context;
  if (user.role !== "admin" && user.role !== "super_admin") {
    throw new ORPCError("FORBIDDEN");
  }
  return db.query.faqs.findMany({
    orderBy: (f, { asc }) => [asc(f.sortOrder)],
  });
});

const create = protectedProcedure
  .input(
    z.object({
      question: z.string().trim().min(1),
      answer: z.string().trim().min(1),
      sortOrder: z.number().int().default(0),
      isActive: z.boolean().default(true),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN");
    }
    const [created] = await db.insert(faqs).values(input).returning();
    return created;
  });

const update = protectedProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      question: z.string().trim().min(1).optional(),
      answer: z.string().trim().min(1).optional(),
      sortOrder: z.number().int().optional(),
      isActive: z.boolean().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN");
    }
    const { id, ...data } = input;
    const [updated] = await db
      .update(faqs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(faqs.id, id))
      .returning();
    if (!updated) throw new ORPCError("NOT_FOUND");
    return updated;
  });

const remove = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN");
    }
    await db.delete(faqs).where(eq(faqs.id, input.id));
    return { success: true };
  });

const reorder = protectedProcedure
  .input(
    z.array(z.object({ id: z.string().uuid(), sortOrder: z.number().int() })),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN");
    }
    await Promise.all(
      input.map(({ id, sortOrder }) =>
        db
          .update(faqs)
          .set({ sortOrder, updatedAt: new Date() })
          .where(eq(faqs.id, id)),
      ),
    );
    return { success: true };
  });

export const faqRouter = {
  list,
  listAll,
  create,
  update,
  remove,
  reorder,
};
