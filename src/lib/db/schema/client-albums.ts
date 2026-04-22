import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { users } from "./user";

export const clientAlbums = pgTable("client_albums", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const clientAlbumSelectSchema = createSelectSchema(clientAlbums);
export const clientAlbumInsertSchema = createInsertSchema(clientAlbums);
export const clientAlbumUpdateSchema = createUpdateSchema(clientAlbums);

export type ClientAlbum = typeof clientAlbums.$inferSelect;
export type NewClientAlbum = typeof clientAlbums.$inferInsert;
export type UpdateClientAlbum = z.infer<typeof clientAlbumUpdateSchema>;
