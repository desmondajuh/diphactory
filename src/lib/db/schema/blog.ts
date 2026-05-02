// lib/db/schema/blog.ts
import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { users } from "./user";

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "archived",
]);

export const blogCategories = pgTable("blog_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const blogTags = pgTable("blog_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  categoryId: uuid("category_id").references(() => blogCategories.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull().default(""), // HTML from rich text editor
  coverImage: text("cover_image"),
  coverImageUtKey: text("cover_image_ut_key"),
  status: postStatusEnum("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  publishedAt: timestamp("published_at"),
  readingTime: integer("reading_time"), // minutes, computed on save
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// junction table for post ↔ tags
export const blogPostTags = pgTable("blog_post_tags", {
  postId: uuid("post_id")
    .notNull()
    .references(() => blogPosts.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => blogTags.id, { onDelete: "cascade" }),
});

export const blogPostSelectSchema = createSelectSchema(blogPosts);
export const blogPostInsertSchema = createInsertSchema(blogPosts);
export const blogPostUpdateSchema = createUpdateSchema(blogPosts);
export const blogCategorySelectSchema = createSelectSchema(blogCategories);
export const blogTagSelectSchema = createSelectSchema(blogTags);

export type BlogPost = typeof blogPosts.$inferSelect;
export type BlogCategory = typeof blogCategories.$inferSelect;
export type BlogTag = typeof blogTags.$inferSelect;
export type BlogPostTag = typeof blogPostTags.$inferSelect;
