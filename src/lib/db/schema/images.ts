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

export const images = pgTable(
  "images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
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
  (table) => [index("image_uploader_idx").on(table.uploadedById)],
);

export const imageSelectSchema = createSelectSchema(images);
export const imageInsertSchema = createInsertSchema(images);
export const imageUpdateSchema = createUpdateSchema(images);

export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
export type UpdateImage = z.infer<typeof imageUpdateSchema>;
