// homepage carousel component images. limit 9
import { z } from "zod";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const carouselImages = pgTable("carousel_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  utKey: text("ut_key"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const carouselImageSelectSchema = createSelectSchema(carouselImages);
export type CarouselImage = typeof carouselImages.$inferSelect;

// Faq Data
export const faqs = pgTable("faqs", {
  id: uuid("id").defaultRandom().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const faqSelectSchema = createSelectSchema(faqs);
export type Faq = typeof faqs.$inferSelect;

// Headings Title Data
// lib/db/schema/sections.ts
export const sectionTypeEnum = pgEnum("section_type", [
  "hero",
  "about",
  "cta",
  "stats",
  "features",
]);

export const sections = pgTable("sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  pageSlug: text("page_slug").notNull(), // "home", "about", "services" etc
  sectionType: sectionTypeEnum("section_type").notNull(),
  sectionName: text("section_name").notNull(), // internal label e.g. "Home Hero"
  slug: text("slug").notNull().unique(), // "home-hero", "about-story"
  badge: text("badge"),
  title: text("title"),
  subtitle: text("subtitle"),
  description: text("description"),
  image: text("image"),
  imageUtKey: text("image_ut_key"),
  imageAlt: text("image_alt"),
  bgImage: text("bg_image"),
  bgImageUtKey: text("bg_image_ut_key"),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  ctaSecondaryText: text("cta_secondary_text"),
  ctaSecondaryLink: text("cta_secondary_link"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// stat items linked to a stats section
export const statItems = pgTable("stat_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => sections.id, { onDelete: "cascade" }),
  value: text("value").notNull(), // "500+", "99%"
  label: text("label").notNull(), // "Projects", "Satisfaction"
  sortOrder: integer("sort_order").notNull().default(0),
});

// feature/service cards linked to a features section
export const featureItems = pgTable("feature_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => sections.id, { onDelete: "cascade" }),
  icon: text("icon"), // icon name or SVG string
  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  imageUtKey: text("image_ut_key"),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const sectionSelectSchema = createSelectSchema(sections);
export const sectionInsertSchema = createInsertSchema(sections);
export const sectionUpdateSchema = createUpdateSchema(sections);
export const statItemSelectSchema = createSelectSchema(statItems);
export const featureItemSelectSchema = createSelectSchema(featureItems);

export type Section = typeof sections.$inferSelect;
export type StatItem = typeof statItems.$inferSelect;
export type FeatureItem = typeof featureItems.$inferSelect;
export type SectionWithItems = Section & {
  statItems: StatItem[];
  featureItems: FeatureItem[];
};
