// lib/db/schema/site-config.ts
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const siteConfig = pgTable("site_config", {
  id: uuid("id").defaultRandom().primaryKey(),

  // ── Brand ──
  businessName: text("business_name").notNull().default(""),
  shortName: text("short_name").notNull().default(""),
  tagline: text("tagline"),
  description: text("description"), // used for SEO meta description

  // ── Assets ──
  logoUrl: text("logo_url"),
  logoUtKey: text("logo_ut_key"),
  iconUrl: text("icon_url"),
  iconUtKey: text("icon_ut_key"),

  // ── Contact ──
  email: text("email"),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  address: text("address"),
  city: text("city"),
  country: text("country"),

  // ── Social ──
  instagram: text("instagram"),
  facebook: text("facebook"),
  twitter: text("twitter"),
  youtube: text("youtube"),
  tiktok: text("tiktok"),
  linkedin: text("linkedin"),

  // ── SEO ──
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  ogImage: text("og_image"),
  ogImageUtKey: text("og_image_ut_key"),

  // ── Settings ──
  maintenanceMode: boolean("maintenance_mode").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const siteConfigSelectSchema = createSelectSchema(siteConfig);
export const siteConfigUpdateSchema = createUpdateSchema(siteConfig);
export type SiteConfig = typeof siteConfig.$inferSelect;
