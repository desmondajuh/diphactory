import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { users } from "./user";

export const gallery = pgTable(
  "gallery",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title"),
    description: text("description"),
    category: text("category"),
    uploadedById: uuid("uploaded_by_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    utKey: text("ut_key").notNull().unique(),
    utUrl: text("ut_url").notNull(),
    filename: text("filename").notNull(),
    mimeType: text("mime_type"),
    thumbnailUrl: text("thumbnail_url"),
    width: integer("width"),
    height: integer("height"),
    sizeBytes: integer("size_bytes"),
    blurDataUrl: text("blur_data_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("gallery_uploader_idx").on(table.uploadedById)],
);

export const gallerySelectSchema = createSelectSchema(gallery);
export const galleryInsertSchema = createInsertSchema(gallery);
export const galleryUpdateSchema = createUpdateSchema(gallery);

export type GALLERY_IMAGE_TYPE = typeof gallery.$inferSelect;
export type New_GALLERY_IMAGE = typeof gallery.$inferInsert;
export type UPDATE_GALLERY_IMAGE = z.infer<typeof galleryUpdateSchema>;
