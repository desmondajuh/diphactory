import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { z } from "zod";
import { publicProcedure, photographerProcedure } from "@/orpc/base";
import { albumAccesses, albums, leads } from "@/lib/db/schema";

const unlockPrivate = publicProcedure
  .input(
    z.object({
      slug: z.string(),
      email: z.string().email(),
      code: z.string().length(6),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    const normalizedEmail = input.email.toLowerCase();

    const album = await db.query.albums.findFirst({
      where: and(eq(albums.slug, input.slug), eq(albums.isActive, true)),
      with: {
        clientRecord: true,
      },
    });

    if (!album) {
      throw new ORPCError("NOT_FOUND");
    }

    if (album.visibility !== "private") {
      throw new ORPCError("BAD_REQUEST");
    }

    if (album.expiresAt && album.expiresAt < new Date()) {
      throw new ORPCError("FORBIDDEN", { message: "This link has expired" });
    }

    if (album.clientRecord?.email) {
      const expectedEmail = album.clientRecord.email.toLowerCase();
      if (expectedEmail !== normalizedEmail) {
        throw new ORPCError("FORBIDDEN", {
          message: "This album is restricted to the invited client email",
        });
      }
    }

    if (!album.accessCode) {
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    const valid = await compare(input.code.toUpperCase(), album.accessCode);
    if (!valid) {
      throw new ORPCError("FORBIDDEN", { message: "Invalid code" });
    }

    const [access] = await db
      .insert(albumAccesses)
      .values({
        albumId: album.id,
        visitorEmail: normalizedEmail,
        userId: user?.id ?? null,
        lastAccessedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [albumAccesses.albumId, albumAccesses.visitorEmail],
        set: {
          userId: user?.id ?? null,
          lastAccessedAt: new Date(),
        },
      })
      .returning();

    return { accessId: access.id, albumId: album.id };
  });

const capturePublicVisitor = publicProcedure
  .input(
    z.object({
      slug: z.string(),
      email: z.string().email(),
      name: z.string().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;
    const normalizedEmail = input.email.toLowerCase();

    const album = await db.query.albums.findFirst({
      where: and(
        eq(albums.slug, input.slug),
        eq(albums.visibility, "public"),
        eq(albums.isActive, true),
      ),
    });

    if (!album) {
      throw new ORPCError("NOT_FOUND");
    }

    await db
      .insert(leads)
      .values({
        albumId: album.id,
        email: normalizedEmail,
        name: input.name,
      })
      .onConflictDoNothing();

    const [access] = await db
      .insert(albumAccesses)
      .values({
        albumId: album.id,
        visitorEmail: normalizedEmail,
        userId: user?.id ?? null,
        lastAccessedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [albumAccesses.albumId, albumAccesses.visitorEmail],
        set: {
          userId: user?.id ?? null,
          lastAccessedAt: new Date(),
        },
      })
      .returning();

    return { accessId: access.id };
  });

const listLeads = photographerProcedure
  .input(z.object({ albumId: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    const album = await db.query.albums.findFirst({
      where: and(eq(albums.id, input.albumId), eq(albums.ownerId, user.id)),
    });

    if (!album) {
      throw new ORPCError("NOT_FOUND");
    }

    return db.query.leads.findMany({
      where: eq(leads.albumId, input.albumId),
      orderBy: (lead, { desc }) => [desc(lead.capturedAt)],
    });
  });

export const accessRouter = { unlockPrivate, capturePublicVisitor, listLeads };
