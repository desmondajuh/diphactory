import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  parentId: uuid("parent_id"),
  image: text("image"),
  ordering: integer("ordering").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
});

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
}));

export const insertCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: z.string().uuid().optional().nullable(),
  image: z.string().url().optional().nullable(),
  ordering: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
});
export const selectCategorySchema = insertCategorySchema.extend({
  id: z.string().uuid(),
});
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type SelectCategory = z.infer<typeof selectCategorySchema>;
