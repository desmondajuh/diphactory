// orpc/routers/site-config.ts
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "@/orpc/base";
import { siteConfig } from "@/lib/db/schema";
import { utapi } from "@/lib/uploadthing";

// always returns the single config row
async function getConfig(db: typeof import("@/lib/db").db) {
  const [config] = await db.select().from(siteConfig).limit(1);
  if (!config)
    throw new ORPCError("NOT_FOUND", { message: "Site config not found" });
  return config;
}

// Public — used anywhere on the site
const get = publicProcedure.handler(async ({ context }) => {
  return getConfig(context.db);
});

// Admin — update config
const update = protectedProcedure
  .input(
    z.object({
      businessName: z.string().optional(),
      shortName: z.string().optional(),
      tagline: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      logoUrl: z.string().optional().nullable(),
      logoUtKey: z.string().optional().nullable(),
      iconUrl: z.string().optional().nullable(),
      iconUtKey: z.string().optional().nullable(),
      email: z.string().email().optional().nullable(),
      phone: z.string().optional().nullable(),
      whatsapp: z.string().optional().nullable(),
      address: z.string().optional().nullable(),
      city: z.string().optional().nullable(),
      country: z.string().optional().nullable(),
      instagram: z.string().optional().nullable(),
      facebook: z.string().optional().nullable(),
      twitter: z.string().optional().nullable(),
      youtube: z.string().optional().nullable(),
      tiktok: z.string().optional().nullable(),
      linkedin: z.string().optional().nullable(),
      metaTitle: z.string().optional().nullable(),
      metaDescription: z.string().optional().nullable(),
      ogImage: z.string().optional().nullable(),
      ogImageUtKey: z.string().optional().nullable(),
      maintenanceMode: z.boolean().optional(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { db, user } = context;

    if (user.role !== "admin" && user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN");
    }

    const existing = await getConfig(db);

    // ── Clean up replaced UT assets ──
    const keysToDelete: string[] = [];

    const assetFields = [
      { newKey: input.logoUtKey, existingKey: existing.logoUtKey },
      { newKey: input.iconUtKey, existingKey: existing.iconUtKey },
      { newKey: input.ogImageUtKey, existingKey: existing.ogImageUtKey },
    ];

    for (const { newKey, existingKey } of assetFields) {
      if (newKey && existingKey && newKey !== existingKey) {
        keysToDelete.push(existingKey);
      }
    }

    const [updated] = await db
      .update(siteConfig)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(siteConfig.id, existing.id))
      .returning();

    if (keysToDelete.length > 0) {
      await utapi.deleteFiles(keysToDelete);
    }

    return updated;
  });

export const siteConfigRouter = {
  get,
  update,
};
