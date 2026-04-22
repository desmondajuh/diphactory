import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientName: text("client_name").notNull(),
    clientTitle: text("client_title"),
    clientImage: text("client_image"),
    quote: text("quote").notNull(),
    rating: integer("rating").notNull().default(5),
    dateLabel: text("date_label"),
    isPublished: boolean("is_published").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    ratingRange: sql`CHECK (${t.rating.name} BETWEEN 1 AND 5)`,
  }),
);

export const insertTestimonialSchema = z.object({
  clientName: z.string().trim().min(1),
  clientTitle: z.string().trim().optional().nullable(),
  clientImage: z.string().url().optional().nullable(),
  quote: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5).default(5),
  dateLabel: z.string().trim().optional().nullable(),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const selectTestimonialSchema = insertTestimonialSchema.extend({
  id: z.string().uuid(),
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type SelectTestimonial = z.infer<typeof selectTestimonialSchema>;
