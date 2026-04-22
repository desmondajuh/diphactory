import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    rating: integer("rating").notNull(),
    image: text("image"),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    ratingRange: sql`CHECK (${t.rating.name} BETWEEN 1 AND 5)`,
  }),
);

export const insertReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  createdAt: z.date().optional(),
});
export const selectReviewSchema = insertReviewSchema.extend({
  id: z.string().uuid(),
});
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type SelectReview = z.infer<typeof selectReviewSchema>;
