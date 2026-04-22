import {
  boolean,
  index,
  integer,
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
import { images } from "./images";

export const albumImages = pgTable(
  "album_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    albumId: uuid("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    imageId: uuid("image_id")
      .notNull()
      .references(() => images.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    caption: text("caption"),
    isCover: boolean("is_cover").notNull().default(false),
    addedAt: timestamp("added_at").notNull().defaultNow(),
  },
  (table) => [
    unique().on(table.albumId, table.imageId),
    index("ai_album_idx").on(table.albumId),
    index("ai_image_idx").on(table.imageId),
  ],
);

export const albumImageSelectSchema = createSelectSchema(albumImages);
export const albumImageInsertSchema = createInsertSchema(albumImages);
export const albumImageUpdateSchema = createUpdateSchema(albumImages);

export type AlbumImage = typeof albumImages.$inferSelect;
export type NewAlbumImage = typeof albumImages.$inferInsert;
export type UpdateAlbumImage = z.infer<typeof albumImageUpdateSchema>;
