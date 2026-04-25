import {
  boolean,
  index,
  pgEnum,
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
import { clients } from "./clients";
import { users } from "./user";

export const albumTypeEnum = pgEnum("album_type", ["shoot", "collection"]);
export const albumVisibilityEnum = pgEnum("album_visibility", [
  "public",
  "private",
]);

export const albums = pgTable(
  "albums",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    collectionOwnerId: uuid("collection_owner_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    clientId: uuid("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),
    coverImageId: uuid("cover_image_id"),
    type: albumTypeEnum("type").notNull().default("shoot"),
    visibility: albumVisibilityEnum("visibility").notNull().default("private"),
    accessCode: text("access_code"),
    accessCodePlain: text("access_code_plain"),
    isActive: boolean("is_active").notNull().default(true),
    shootDate: timestamp("shoot_date"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("album_owner_idx").on(table.ownerId),
    index("album_client_idx").on(table.clientId),
    index("album_collection_owner_idx").on(table.collectionOwnerId),
  ],
);

export const albumSelectSchema = createSelectSchema(albums);
export const albumInsertSchema = createInsertSchema(albums);
export const albumUpdateSchema = createUpdateSchema(albums);

export type Album = typeof albums.$inferSelect;
export type NewAlbum = typeof albums.$inferInsert;
export type UpdateAlbum = z.infer<typeof albumUpdateSchema>;
