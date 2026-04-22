import {
  index,
  pgTable,
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
import { albumAccesses } from "./album-access";
import { images } from "./images";

export const favorites = pgTable(
  "favorites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    albumAccessId: uuid("album_access_id")
      .notNull()
      .references(() => albumAccesses.id, { onDelete: "cascade" }),
    imageId: uuid("image_id")
      .notNull()
      .references(() => images.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique().on(table.albumAccessId, table.imageId),
    index("fav_access_idx").on(table.albumAccessId),
  ],
);

export const favoriteSelectSchema = createSelectSchema(favorites);
export const favoriteInsertSchema = createInsertSchema(favorites);
export const favoriteUpdateSchema = createUpdateSchema(favorites);

export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
export type UpdateFavorite = z.infer<typeof favoriteUpdateSchema>;
