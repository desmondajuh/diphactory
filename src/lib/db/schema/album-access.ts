import {
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { albums } from "./albums";
import { users } from "./user";

export const albumAccesses = pgTable(
  "album_accesses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    albumId: uuid("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    visitorEmail: text("visitor_email").notNull(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    firstAccessedAt: timestamp("first_accessed_at").notNull().defaultNow(),
    lastAccessedAt: timestamp("last_accessed_at").notNull().defaultNow(),
  },
  (table) => [
    unique().on(table.albumId, table.visitorEmail),
    index("aa_album_idx").on(table.albumId),
    index("aa_email_idx").on(table.visitorEmail),
  ],
);

export const albumAccessSelectSchema = createSelectSchema(albumAccesses);
export const albumAccessInsertSchema = createInsertSchema(albumAccesses);
export const albumAccessUpdateSchema = createUpdateSchema(albumAccesses);

export type AlbumAccess = typeof albumAccesses.$inferSelect;
export type NewAlbumAccess = typeof albumAccesses.$inferInsert;
export type UpdateAlbumAccess = z.infer<typeof albumAccessUpdateSchema>;
