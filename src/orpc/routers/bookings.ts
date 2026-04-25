import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "@/orpc/base";
import { bookings } from "@/lib/db/schema";

const create = publicProcedure
  .input(
    z.object({
      sessionType: z.string().trim().min(1).max(80),
      preferredDate: z.string().trim().min(1).max(40),
      timeSlot: z.string().trim().min(1).max(40),
      firstName: z.string().trim().min(1).max(80),
      lastName: z.string().trim().min(1).max(80),
      email: z.string().email(),
      phone: z.string().trim().max(40).optional(),
      location: z.string().trim().max(160).optional(),
      notes: z.string().trim().max(1000).optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db } = context;

    const [booking] = await db
      .insert(bookings)
      .values({
        sessionType: input.sessionType,
        preferredDate: input.preferredDate,
        timeSlot: input.timeSlot,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        location: input.location,
        notes: input.notes,
      })
      .returning();

    return booking;
  });

const list = protectedProcedure.handler(async ({ context }) => {
  const { db, user } = context;

  if (user.role !== "admin" && user.role !== "super_admin") {
    throw new ORPCError("FORBIDDEN", {
      message: "Only admins can view booking submissions",
    });
  }

  return db.query.bookings.findMany({
    orderBy: (booking, { desc }) => [desc(booking.createdAt)],
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

    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN", {
        message: "Only admins can update booking status",
      });
    }

    const [updated] = await db
      .update(bookings)
      .set({
        status: input.status,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, input.bookingId))
      .returning();

    return updated;
  });

export const bookingsRouter = {
  create,
  list,
  updateStatus,
};
