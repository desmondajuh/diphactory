import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";

export const contactRequests = pgTable("contact_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  service: text("service"),
  budget: text("budget"),
  location: text("location"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactRequestsSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  service: z.string().optional(),
  budget: z.string().optional(),
  location: z.string().optional(),
  message: z.string().min(10).max(500),
  createdAt: z.date().optional(),
});
export const selectContactRequestsSchema = insertContactRequestsSchema.extend({
  id: z.string().uuid(),
});
export type InsertContactRequest = z.infer<typeof insertContactRequestsSchema>;
export type SelectContactRequest = z.infer<typeof selectContactRequestsSchema>;
