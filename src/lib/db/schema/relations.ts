// ── Relations ────────────────────────────────────────────
import { relations } from "drizzle-orm";
import { users } from "./user";
import { albums } from "./albums";
import { albumAccesses } from "./album-access";
import { images } from "./images";
import { favorites } from "./favorites";
import { clients } from "./clients";
import { leads } from "./leads";
import { albumImages } from "./album-images";
import { gallery } from "./gallery";
import { sections, statItems, featureItems } from "./components";

import { blogPosts, blogCategories, blogTags, blogPostTags } from "./blog";

export const usersRelations = relations(users, ({ many }) => ({
  ownedAlbums: many(albums, { relationName: "owner" }),
  collections: many(albums, { relationName: "collectionOwner" }),
  clientRecords: many(clients),
  uploadedImages: many(images),
  albumAccesses: many(albumAccesses),
}));

export const albumsRelations = relations(albums, ({ one, many }) => ({
  owner: one(users, {
    fields: [albums.ownerId],
    references: [users.id],
    relationName: "owner",
  }),
  collectionOwner: one(users, {
    fields: [albums.collectionOwnerId],
    references: [users.id],
    relationName: "collectionOwner",
  }),
  clientRecord: one(clients, {
    fields: [albums.clientId],
    references: [clients.id],
  }),
  albumImages: many(albumImages),
  accesses: many(albumAccesses),
  leads: many(leads),
}));

export const albumImagesRelations = relations(albumImages, ({ one }) => ({
  album: one(albums, {
    fields: [albumImages.albumId],
    references: [albums.id],
  }),
  image: one(images, {
    fields: [albumImages.imageId],
    references: [images.id],
  }),
}));

export const albumAccessesRelations = relations(
  albumAccesses,
  ({ one, many }) => ({
    album: one(albums, {
      fields: [albumAccesses.albumId],
      references: [albums.id],
    }),
    user: one(users, {
      fields: [albumAccesses.userId],
      references: [users.id],
    }),
    favorites: many(favorites),
  }),
);

export const favoritesRelations = relations(favorites, ({ one }) => ({
  albumAccess: one(albumAccesses, {
    fields: [favorites.albumAccessId],
    references: [albumAccesses.id],
  }),
  image: one(images, { fields: [favorites.imageId], references: [images.id] }),
}));

export const imagesRelations = relations(images, ({ one, many }) => ({
  uploadedBy: one(users, {
    fields: [images.uploadedById],
    references: [users.id],
  }),
  albumImages: many(albumImages),
  favorites: many(favorites),
}));

export const clientRecordsRelations = relations(clients, ({ one, many }) => ({
  photographer: one(users, {
    fields: [clients.photographerId],
    references: [users.id],
  }),
  linkedUser: one(users, {
    fields: [clients.linkedUserId],
    references: [users.id],
  }),
  albums: many(albums),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  album: one(albums, {
    fields: [leads.albumId],
    references: [albums.id],
  }),
}));

export const galleryRelations = relations(gallery, ({ one }) => ({
  album: one(albums, {
    fields: [gallery.albumId],
    references: [albums.id],
  }),
}));

export const sectionsRelations = relations(sections, ({ many }) => ({
  statItems: many(statItems),
  featureItems: many(featureItems),
}));

export const statItemsRelations = relations(statItems, ({ one }) => ({
  section: one(sections, {
    fields: [statItems.sectionId],
    references: [sections.id],
  }),
}));

export const featureItemsRelations = relations(featureItems, ({ one }) => ({
  section: one(sections, {
    fields: [featureItems.sectionId],
    references: [sections.id],
  }),
}));

// blog
// lib/db/schema/relations.ts — add these

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(users, { fields: [blogPosts.authorId], references: [users.id] }),
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
  postTags: many(blogPostTags),
}));

export const blogCategoriesRelations = relations(
  blogCategories,
  ({ many }) => ({
    posts: many(blogPosts),
  }),
);

export const blogTagsRelations = relations(blogTags, ({ many }) => ({
  postTags: many(blogPostTags),
}));

export const blogPostTagsRelations = relations(blogPostTags, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogPostTags.postId],
    references: [blogPosts.id],
  }),
  tag: one(blogTags, {
    fields: [blogPostTags.tagId],
    references: [blogTags.id],
  }),
}));
