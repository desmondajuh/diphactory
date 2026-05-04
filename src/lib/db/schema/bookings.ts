import {
  boolean,
  integer,
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

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionType: text("session_type").notNull(),
  preferredDate: text("preferred_date").notNull(),
  timeSlot: text("time_slot").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  notes: text("notes"),
  status: bookingStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const bookingSelectSchema = createSelectSchema(bookings);
export const bookingInsertSchema = createInsertSchema(bookings);
export const bookingUpdateSchema = createUpdateSchema(bookings);

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type UpdateBooking = z.infer<typeof bookingUpdateSchema>;

// lib/db/schema/bookings.ts — add to existing file

export const bookingSessionTypes = pgTable("booking_session_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  description: text("description"),
  duration: text("duration").notNull(),
  price: integer("price").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const bookingTimeSlots = pgTable("booking_time_slots", {
  id: uuid("id").defaultRandom().primaryKey(),
  time: text("time").notNull(), // "8:00 AM"
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

// tracks which slots are booked on which dates
export const bookingSlotReservations = pgTable("booking_slot_reservations", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // "2024-03-15"
  timeSlotId: uuid("time_slot_id")
    .notNull()
    .references(() => bookingTimeSlots.id, { onDelete: "restrict" }),
});

export type BookingSessionType = typeof bookingSessionTypes.$inferSelect;
export type BookingTimeSlot = typeof bookingTimeSlots.$inferSelect;
export type BookingSlotReservation =
  typeof bookingSlotReservations.$inferSelect;
