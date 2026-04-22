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

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    albumId: uuid("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    capturedAt: timestamp("captured_at").notNull().defaultNow(),
  },
  (table) => [
    unique().on(table.albumId, table.email),
    index("lc_album_idx").on(table.albumId),
  ],
);

export const leadSelectSchema = createSelectSchema(leads);
export const leadInsertSchema = createInsertSchema(leads);
export const leadUpdateSchema = createUpdateSchema(leads);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type UpdateLead = z.infer<typeof leadUpdateSchema>;
