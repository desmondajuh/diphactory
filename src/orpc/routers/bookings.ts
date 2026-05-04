import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "@/orpc/base";
// import { bookings } from "@/lib/db/schema";
import {
  bookings,
  bookingSessionTypes,
  bookingTimeSlots,
  bookingSlotReservations,
} from "@/lib/db/schema";

const isAdmin = (role: string) => ["admin", "super_admin"].includes(role);

// ── Public ──

// fetch all active session types for the booking page
const listSessionTypes = publicProcedure.handler(async ({ context }) => {
  return context.db.query.bookingSessionTypes.findMany({
    where: (s, { eq }) => eq(s.isActive, true),
    orderBy: (s, { asc }) => [asc(s.sortOrder)],
  });
});

// fetch all active time slots
const listTimeSlots = publicProcedure.handler(async ({ context }) => {
  return context.db.query.bookingTimeSlots.findMany({
    where: (s, { eq }) => eq(s.isActive, true),
    orderBy: (s, { asc }) => [asc(s.sortOrder)],
  });
});

// get booked slots for a specific date
const getBookedSlots = publicProcedure
  .input(z.object({ date: z.string() }))
  .handler(async ({ input, context }) => {
    const { db } = context;
    const reservations = await db.query.bookingSlotReservations.findMany({
      where: (r, { eq }) => eq(r.date, input.date),
      with: { timeSlot: true },
    });
    return reservations.map((r) => r.timeSlotId);
  });

// get all booked dates with their booked slot counts
// used to highlight unavailable dates on the calendar
const getBookedDates = publicProcedure.handler(async ({ context }) => {
  const { db } = context;

  const totalSlots = await db.query.bookingTimeSlots.findMany({
    where: (s, { eq }) => eq(s.isActive, true),
  });

  const reservations = await db.query.bookingSlotReservations.findMany();

  // group by date → count booked slots
  const dateCounts = reservations.reduce<Record<string, number>>((acc, r) => {
    acc[r.date] = (acc[r.date] ?? 0) + 1;
    return acc;
  }, {});

  // return dates that are fully booked
  return Object.entries(dateCounts)
    .filter(([, count]) => count >= totalSlots.length)
    .map(([date]) => date);
});

// create a booking and reserve the slot
const create = publicProcedure
  .input(
    z.object({
      sessionTypeId: z.string().uuid(),
      preferredDate: z.string(),
      timeSlotId: z.string().uuid(),
      firstName: z.string().min(1).max(80),
      lastName: z.string().min(1).max(80),
      email: z.string().email(),
      phone: z.string().optional(),
      location: z.string().optional(),
      notes: z.string().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db } = context;
    const { sessionTypeId, timeSlotId, preferredDate, ...rest } = input;

    // verify session type exists
    const sessionType = await db.query.bookingSessionTypes.findFirst({
      where: eq(bookingSessionTypes.id, sessionTypeId),
    });
    if (!sessionType)
      throw new ORPCError("NOT_FOUND", { message: "Session type not found" });

    // verify time slot exists and is active
    const timeSlot = await db.query.bookingTimeSlots.findFirst({
      where: and(
        eq(bookingTimeSlots.id, timeSlotId),
        eq(bookingTimeSlots.isActive, true),
      ),
    });
    if (!timeSlot)
      throw new ORPCError("NOT_FOUND", { message: "Time slot not found" });

    // check slot is not already reserved
    const existing = await db.query.bookingSlotReservations.findFirst({
      where: (r, { eq, and }) =>
        and(eq(r.date, preferredDate), eq(r.timeSlotId, timeSlotId)),
    });
    if (existing) {
      throw new ORPCError("CONFLICT", {
        message:
          "This time slot is no longer available. Please choose another.",
      });
    }

    // create booking
    const [booking] = await db
      .insert(bookings)
      .values({
        ...rest,
        sessionType: sessionType.label,
        preferredDate,
        timeSlot: timeSlot.time,
      })
      .returning();

    // reserve the slot
    await db.insert(bookingSlotReservations).values({
      bookingId: booking.id,
      date: preferredDate,
      timeSlotId,
    });

    return booking;
  });

// ── Admin ──

const list = protectedProcedure.handler(async ({ context }) => {
  const { db, user } = context;
  if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");

  return db.query.bookings.findMany({
    orderBy: (b, { desc }) => [desc(b.createdAt)],
  });
});

const updateStatus = protectedProcedure
  .input(
    z.object({
      bookingId: z.string().uuid(),
      status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");

    const [updated] = await db
      .update(bookings)
      .set({ status: input.status, updatedAt: new Date() })
      .where(eq(bookings.id, input.bookingId))
      .returning();

    // if cancelled, free up the slot reservation
    if (input.status === "cancelled") {
      await db
        .delete(bookingSlotReservations)
        .where(eq(bookingSlotReservations.bookingId, input.bookingId));
    }

    return updated;
  });

// ── Admin — session type management ──

const listAllSessionTypes = protectedProcedure.handler(async ({ context }) => {
  const { db, user } = context;
  if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
  return db.query.bookingSessionTypes.findMany({
    orderBy: (s, { asc }) => [asc(s.sortOrder)],
  });
});

const createSessionType = protectedProcedure
  .input(
    z.object({
      label: z.string().min(1),
      description: z.string().optional().nullable(),
      duration: z.string().min(1),
      price: z.number().int().positive(),
      isActive: z.boolean().default(true),
      sortOrder: z.number().int().default(0),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
    const [created] = await db
      .insert(bookingSessionTypes)
      .values(input)
      .returning();
    return created;
  });

const updateSessionType = protectedProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      label: z.string().min(1).optional(),
      description: z.string().optional().nullable(),
      duration: z.string().optional(),
      price: z.number().int().positive().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().int().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
    const { id, ...data } = input;
    const [updated] = await db
      .update(bookingSessionTypes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(bookingSessionTypes.id, id))
      .returning();
    return updated;
  });

const deleteSessionType = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
    await db
      .delete(bookingSessionTypes)
      .where(eq(bookingSessionTypes.id, input.id));
    return { success: true };
  });

// ── Admin — time slot management ──

const listAllTimeSlots = protectedProcedure.handler(async ({ context }) => {
  const { db, user } = context;
  if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
  return db.query.bookingTimeSlots.findMany({
    orderBy: (s, { asc }) => [asc(s.sortOrder)],
  });
});

const createTimeSlot = protectedProcedure
  .input(
    z.object({
      time: z.string().min(1),
      isActive: z.boolean().default(true),
      sortOrder: z.number().int().default(0),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
    const [created] = await db
      .insert(bookingTimeSlots)
      .values(input)
      .returning();
    return created;
  });

const updateTimeSlot = protectedProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      time: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().int().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
    const { id, ...data } = input;
    const [updated] = await db
      .update(bookingTimeSlots)
      .set(data)
      .where(eq(bookingTimeSlots.id, id))
      .returning();
    return updated;
  });

const deleteTimeSlot = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    if (!isAdmin(user.role)) throw new ORPCError("FORBIDDEN");
    await db.delete(bookingTimeSlots).where(eq(bookingTimeSlots.id, input.id));
    return { success: true };
  });

// const createOld = publicProcedure
//   .input(
//     z.object({
//       sessionType: z.string().trim().min(1).max(80),
//       preferredDate: z.string().trim().min(1).max(40),
//       timeSlot: z.string().trim().min(1).max(40),
//       firstName: z.string().trim().min(1).max(80),
//       lastName: z.string().trim().min(1).max(80),
//       email: z.string().email(),
//       phone: z.string().trim().max(40).optional(),
//       location: z.string().trim().max(160).optional(),
//       notes: z.string().trim().max(1000).optional(),
//     }),
//   )
//   .handler(async ({ input, context }) => {
//     const { db } = context;

//     const [booking] = await db
//       .insert(bookings)
//       .values({
//         sessionType: input.sessionType,
//         preferredDate: input.preferredDate,
//         timeSlot: input.timeSlot,
//         firstName: input.firstName,
//         lastName: input.lastName,
//         email: input.email.toLowerCase(),
//         phone: input.phone,
//         location: input.location,
//         notes: input.notes,
//       })
//       .returning();

//     return booking;
//   });

// const list = protectedProcedure.handler(async ({ context }) => {
//   const { db, user } = context;

//   if (user.role !== "admin" && user.role !== "super_admin") {
//     throw new ORPCError("FORBIDDEN", {
//       message: "Only admins can view booking submissions",
//     });
//   }

//   return db.query.bookings.findMany({
//     orderBy: (booking, { desc }) => [desc(booking.createdAt)],
//   });
// });

// const updateStatus = protectedProcedure
//   .input(
//     z.object({
//       bookingId: z.string().uuid(),
//       status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
//     }),
//   )
//   .handler(async ({ input, context }) => {
//     const { db, user } = context;

//     if (user.role !== "admin" && user.role !== "super_admin") {
//       throw new ORPCError("FORBIDDEN", {
//         message: "Only admins can update booking status",
//       });
//     }

//     const [updated] = await db
//       .update(bookings)
//       .set({
//         status: input.status,
//         updatedAt: new Date(),
//       })
//       .where(eq(bookings.id, input.bookingId))
//       .returning();

//     return updated;
//   });

export const bookingsRouter = {
  // public
  listSessionTypes,
  listTimeSlots,
  getBookedSlots,
  getBookedDates,
  create,
  // admin — bookings
  list,
  updateStatus,
  // admin — session types
  listAllSessionTypes,
  createSessionType,
  updateSessionType,
  deleteSessionType,
  // admin — time slots
  listAllTimeSlots,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
};
