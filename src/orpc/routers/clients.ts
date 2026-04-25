import { ORPCError } from "@orpc/server";
import { and, count, eq } from "drizzle-orm";
import { z } from "zod";
import { photographerProcedure } from "@/orpc/base";
import { albums, clients } from "@/lib/db/schema";

const list = photographerProcedure.handler(async ({ context }) => {
  const { db, user } = context;

  const rows = await db.query.clients.findMany({
    where: eq(clients.photographerId, user.id),
    with: {
      albums: {
        columns: {
          id: true,
          title: true,
          slug: true,
          visibility: true,
          createdAt: true,
        },
        orderBy: (album, { desc }) => [desc(album.createdAt)],
      },
    },
    orderBy: (client, { desc }) => [desc(client.createdAt)],
  });

  return rows.map((clientRecord) => ({
    ...clientRecord,
    albumCount: clientRecord.albums.length,
    latestAlbum: clientRecord.albums[0] ?? null,
  }));
});

const create = photographerProcedure
  .input(
    z.object({
      name: z.string().trim().min(1).max(120),
      email: z.string().email(),
      phone: z.string().trim().max(40).optional(),
      notes: z.string().trim().max(500).optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    const normalizedEmail = input.email.trim().toLowerCase();

    const existing = await db.query.clients.findFirst({
      where: and(
        eq(clients.photographerId, user.id),
        eq(clients.email, normalizedEmail),
      ),
    });

    if (existing) {
      throw new ORPCError("CONFLICT", {
        message: "A client with this email already exists",
      });
    }

    const [clientRecord] = await db
      .insert(clients)
      .values({
        photographerId: user.id,
        name: input.name,
        email: normalizedEmail,
        phone: input.phone,
        notes: input.notes,
      })
      .returning();

    return clientRecord;
  });

const update = photographerProcedure
  .input(
    z.object({
      clientId: z.string().uuid(),
      name: z.string().trim().min(1).max(120),
      email: z.string().email(),
      phone: z.string().trim().max(40).optional(),
      notes: z.string().trim().max(500).optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    const normalizedEmail = input.email.trim().toLowerCase();

    const existing = await db.query.clients.findFirst({
      where: and(
        eq(clients.id, input.clientId),
        eq(clients.photographerId, user.id),
      ),
    });

    if (!existing) {
      throw new ORPCError("NOT_FOUND");
    }

    const duplicate = await db.query.clients.findFirst({
      where: and(
        eq(clients.photographerId, user.id),
        eq(clients.email, normalizedEmail),
      ),
    });

    if (duplicate && duplicate.id !== input.clientId) {
      throw new ORPCError("CONFLICT", {
        message: "Another client already uses this email",
      });
    }

    const [updated] = await db
      .update(clients)
      .set({
        name: input.name,
        email: normalizedEmail,
        phone: input.phone,
        notes: input.notes,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, input.clientId))
      .returning();

    return updated;
  });

const getStats = photographerProcedure.handler(async ({ context }) => {
  const { db, user } = context;

  const [[{ value: totalClients }], [{ value: totalAlbumsLinked }]] =
    await Promise.all([
      db
        .select({ value: count() })
        .from(clients)
        .where(eq(clients.photographerId, user.id)),
      db
        .select({ value: count() })
        .from(albums)
        .innerJoin(clients, eq(albums.clientId, clients.id))
        .where(eq(clients.photographerId, user.id)),
    ]);

  return { totalClients, totalAlbumsLinked };
});

export const clientsRouter = {
  list,
  create,
  update,
  stats: getStats,
};
