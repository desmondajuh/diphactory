// orpc/routers/blog.ts
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from "nanoid";
import { protectedProcedure, publicProcedure } from "@/orpc/base";
import {
  blogPosts,
  blogCategories,
  blogTags,
  blogPostTags,
} from "@/lib/db/schema";
import { utapi } from "@/lib/uploadthing";
import { slugify } from "@/utils/slugify";

// ── helpers ──
function estimateReadingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

const isAdmin = (role: string) =>
  ["admin", "super_admin", "photographer"].includes(role);

// ── public ──

const listPublished = publicProcedure
  .input(
    z
      .object({
        categorySlug: z.string().optional(),
        tagSlug: z.string().optional(),
        limit: z.number().int().default(12),
        offset: z.number().int().default(0),
      })
      .optional(),
  )
  .handler(async ({ input, context }) => {
    const { db } = context;
    return db.query.blogPosts.findMany({
      where: (p, { eq, and }) =>
        and(
          eq(p.status, "published"),
          input?.categorySlug
            ? eq(
                p.categoryId,
                db.query.blogCategories
                  .findFirst({
                    where: eq(blogCategories.slug, input.categorySlug),
                  })
                  .then((c) => c?.id ?? "") as unknown as string,
              )
            : undefined,
        ),
      orderBy: (p, { desc }) => [desc(p.publishedAt)],
      limit: input?.limit ?? 12,
      offset: input?.offset ?? 0,
      with: {
        category: true,
        postTags: { with: { tag: true } },
      },
    });
  });

const listFeatured = publicProcedure
  .input(z.object({ limit: z.number().int().default(3) }).optional())
  .handler(async ({ input, context }) => {
    const { db } = context;
    return db.query.blogPosts.findMany({
      where: (p, { eq, and }) =>
        and(eq(p.status, "published"), eq(p.isFeatured, true)),
      orderBy: (p, { desc }) => [desc(p.publishedAt)],
      limit: input?.limit ?? 3,
      with: {
        category: true,
        postTags: { with: { tag: true } },
      },
    });
  });

const getBySlug = publicProcedure
  .input(z.object({ slug: z.string() }))
  .handler(async ({ input, context }) => {
    const { db } = context;
    const post = await db.query.blogPosts.findFirst({
      where: (p, { eq, and }) =>
        and(eq(p.slug, input.slug), eq(p.status, "published")),
      with: {
        author: { columns: { name: true, image: true } },
        category: true,
        postTags: { with: { tag: true } },
      },
    });
    if (!post) throw new ORPCError("NOT_FOUND");
    return post;
  });

const listCategories = publicProcedure.handler(async ({ context }) => {
  return context.db.query.blogCategories.findMany({
    orderBy: (c, { asc }) => [asc(c.name)],
  });
});

const listTags = publicProcedure.handler(async ({ context }) => {
  return context.db.query.blogTags.findMany({
    orderBy: (t, { asc }) => [asc(t.name)],
  });
});

// ── admin ──

const listAll = protectedProcedure.handler(async ({ context }) => {
  const { db, user } = context;
  if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
  return db.query.blogPosts.findMany({
    orderBy: (p, { desc }) => [desc(p.createdAt)],
    with: { category: true, postTags: { with: { tag: true } } },
  });
});

const getByIdAdmin = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, input.id),
      with: { category: true, postTags: { with: { tag: true } } },
    });
    if (!post) throw new ORPCError("NOT_FOUND");
    return post;
  });

const create = protectedProcedure
  .input(
    z.object({
      title: z.string().min(1),
      slug: z.string().optional(),
      excerpt: z.string().optional().nullable(),
      content: z.string().default(""),
      coverImage: z.string().optional().nullable(),
      coverImageUtKey: z.string().optional().nullable(),
      categoryId: z.string().uuid().optional().nullable(),
      tagIds: z.array(z.string().uuid()).default([]),
      status: z.enum(["draft", "published", "archived"]).default("draft"),
      isFeatured: z.boolean().default(false),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");

    const { tagIds, ...postData } = input;
    const slug = postData.slug || `${slugify(postData.title)}-${nanoid(6)}`;

    const [post] = await db
      .insert(blogPosts)
      .values({
        ...postData,
        slug,
        authorId: user.id,
        readingTime: estimateReadingTime(postData.content),
        publishedAt: postData.status === "published" ? new Date() : null,
      })
      .returning();

    if (tagIds.length) {
      await db
        .insert(blogPostTags)
        .values(tagIds.map((tagId) => ({ postId: post.id, tagId })));
    }

    return post;
  });

const update = protectedProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      title: z.string().min(1).optional(),
      slug: z.string().optional(),
      excerpt: z.string().optional().nullable(),
      content: z.string().optional(),
      coverImage: z.string().optional().nullable(),
      coverImageUtKey: z.string().optional().nullable(),
      categoryId: z.string().uuid().optional().nullable(),
      tagIds: z.array(z.string().uuid()).optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
      isFeatured: z.boolean().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");

    const { id, tagIds, ...data } = input;

    const existing = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    });
    if (!existing) throw new ORPCError("NOT_FOUND");

    // delete old cover image if replaced
    if (
      data.coverImageUtKey &&
      existing.coverImageUtKey &&
      data.coverImageUtKey !== existing.coverImageUtKey
    ) {
      await utapi.deleteFiles(existing.coverImageUtKey);
    }

    const [updated] = await db
      .update(blogPosts)
      .set({
        ...data,
        readingTime: data.content
          ? estimateReadingTime(data.content)
          : existing.readingTime,
        publishedAt:
          data.status === "published" && !existing.publishedAt
            ? new Date()
            : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();

    // replace tags if provided
    if (tagIds !== undefined) {
      await db.delete(blogPostTags).where(eq(blogPostTags.postId, id));
      if (tagIds.length) {
        await db
          .insert(blogPostTags)
          .values(tagIds.map((tagId) => ({ postId: id, tagId })));
      }
    }

    return updated;
  });

const remove = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");

    const existing = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, input.id),
    });
    if (!existing) throw new ORPCError("NOT_FOUND");

    await db.delete(blogPosts).where(eq(blogPosts.id, input.id));

    if (existing.coverImageUtKey) {
      await utapi.deleteFiles(existing.coverImageUtKey);
    }

    return { success: true };
  });

// ── category & tag management ──

const createCategory = protectedProcedure
  .input(
    z.object({ name: z.string().min(1), description: z.string().optional() }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
    const [created] = await db
      .insert(blogCategories)
      .values({
        name: input.name,
        slug: `${slugify(input.name)}-${nanoid(4)}`,
        description: input.description,
      })
      .returning();
    return created;
  });

const createTag = protectedProcedure
  .input(z.object({ name: z.string().min(1) }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
    const [created] = await db
      .insert(blogTags)
      .values({
        name: input.name,
        slug: `${slugify(input.name)}-${nanoid(4)}`,
      })
      .returning();
    return created;
  });

const deleteCategory = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
    await db.delete(blogCategories).where(eq(blogCategories.id, input.id));
    return { success: true };
  });

const deleteTag = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
    await db.delete(blogTags).where(eq(blogTags.id, input.id));
    return { success: true };
  });

export const blogRouter = {
  listPublished,
  listFeatured,
  getBySlug,
  listCategories,
  listTags,
  listAll,
  getByIdAdmin,
  create,
  update,
  remove,
  createCategory,
  createTag,
  deleteCategory,
  deleteTag,
};
