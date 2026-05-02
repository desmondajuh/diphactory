import type { Outputs } from "@/orpc/routers";

export type AlbumWithImages = Outputs["albums"]["getPublicBySlug"];

// infer the image type from what the router actually returns
export type AlbumImage = AlbumWithImages["albumImages"][number]["image"];

export type AlbumOption = Outputs["albums"]["list"][number];

// blog
export type BlogPostWithRelations = Outputs["blog"]["listAll"][number];
export type BlogPostFull = Outputs["blog"]["getBySlug"];
export type BlogPostFeatured = Outputs["blog"]["listFeatured"][number];
export type BlogCategory = Outputs["blog"]["listCategories"][number];
export type BlogTag = Outputs["blog"]["listTags"][number];
