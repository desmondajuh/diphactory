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
