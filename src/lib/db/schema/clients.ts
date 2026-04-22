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
import { users } from "./user";

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    photographerId: uuid("photographer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    linkedUserId: uuid("linked_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    email: text("email").notNull(),
    name: text("name"),
    phone: text("phone"),
    notes: text("notes"),
    accessCode: text("access_code"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique().on(table.photographerId, table.email),
    index("cr_photographer_idx").on(table.photographerId),
  ],
);

export const clientSelectSchema = createSelectSchema(clients);
export const clientInsertSchema = createInsertSchema(clients);
export const clientUpdateSchema = createUpdateSchema(clients);

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type UpdateClient = z.infer<typeof clientUpdateSchema>;
