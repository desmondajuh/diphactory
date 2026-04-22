import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

export const guests = pgTable("guests", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const guestSelectSchema = createSelectSchema(guests);
export const guestInsertSchema = createInsertSchema(guests);
export const guestUpdateSchema = createUpdateSchema(guests);

export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
export type UpdateGuest = z.infer<typeof guestUpdateSchema>;
