import { and, count, eq, or } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  albumAccesses,
  albumImages,
  albums,
  favorites,
  images,
  leads,
  users,
} from "@/lib/db/schema";

export async function getPhotographerDashboardData(userId: string) {
  const [
    [{ value: totalAlbums }],
    [{ value: publicAlbums }],
    [{ value: privateAlbums }],
    [{ value: totalImages }],
    [{ value: totalAccesses }],
    [{ value: totalLeads }],
    [{ value: totalFavorites }],
    recentAlbums,
  ] = await Promise.all([
    db
      .select({ value: count() })
      .from(albums)
      .where(and(eq(albums.ownerId, userId), eq(albums.type, "shoot"))),
    db
      .select({ value: count() })
      .from(albums)
      .where(
        and(
          eq(albums.ownerId, userId),
          eq(albums.type, "shoot"),
          eq(albums.visibility, "public"),
        ),
      ),
    db
      .select({ value: count() })
      .from(albums)
      .where(
        and(
          eq(albums.ownerId, userId),
          eq(albums.type, "shoot"),
          eq(albums.visibility, "private"),
        ),
      ),
    db
      .select({ value: count() })
      .from(images)
      .where(eq(images.uploadedById, userId)),
    db
      .select({ value: count() })
      .from(albumAccesses)
      .innerJoin(albums, eq(albumAccesses.albumId, albums.id))
      .where(eq(albums.ownerId, userId)),
    db
      .select({ value: count() })
      .from(leads)
      .innerJoin(albums, eq(leads.albumId, albums.id))
      .where(eq(albums.ownerId, userId)),
    db
      .select({ value: count() })
      .from(favorites)
      .innerJoin(albumAccesses, eq(favorites.albumAccessId, albumAccesses.id))
      .innerJoin(albums, eq(albumAccesses.albumId, albums.id))
      .where(eq(albums.ownerId, userId)),
    db.query.albums.findMany({
      where: and(eq(albums.ownerId, userId), eq(albums.type, "shoot")),
      with: {
        clientRecord: {
          columns: {
            name: true,
            email: true,
          },
        },
        albumImages: {
          columns: {
            id: true,
          },
        },
      },
      orderBy: (album, { desc }) => [desc(album.updatedAt)],
      limit: 6,
    }),
  ]);

  return {
    stats: {
      totalAlbums,
      publicAlbums,
      privateAlbums,
      totalImages,
      totalAccesses,
      totalLeads,
      totalFavorites,
    },
    recentAlbums,
  };
}

export async function getClientDashboardData(userId: string, email: string) {
  const normalizedEmail = email.toLowerCase();

  const [
    [{ value: collectionCount }],
    [{ value: savedImagesCount }],
    [{ value: unlockedAlbumsCount }],
    [{ value: favoritesCount }],
    recentAccesses,
  ] = await Promise.all([
    db
      .select({ value: count() })
      .from(albums)
      .where(
        and(
          eq(albums.collectionOwnerId, userId),
          eq(albums.type, "collection"),
        ),
      ),
    db
      .select({ value: count() })
      .from(albumImages)
      .innerJoin(albums, eq(albumImages.albumId, albums.id))
      .where(
        and(
          eq(albums.collectionOwnerId, userId),
          eq(albums.type, "collection"),
        ),
      ),
    db
      .select({ value: count() })
      .from(albumAccesses)
      .where(
        or(
          eq(albumAccesses.userId, userId),
          eq(albumAccesses.visitorEmail, normalizedEmail),
        ),
      ),
    db
      .select({ value: count() })
      .from(favorites)
      .innerJoin(albumAccesses, eq(favorites.albumAccessId, albumAccesses.id))
      .where(
        or(
          eq(albumAccesses.userId, userId),
          eq(albumAccesses.visitorEmail, normalizedEmail),
        ),
      ),
    db.query.albumAccesses.findMany({
      where: or(
        eq(albumAccesses.userId, userId),
        eq(albumAccesses.visitorEmail, normalizedEmail),
      ),
      with: {
        album: {
          columns: {
            id: true,
            title: true,
            slug: true,
            visibility: true,
            isActive: true,
            updatedAt: true,
          },
        },
      },
      orderBy: (access, { desc }) => [desc(access.lastAccessedAt)],
      limit: 6,
    }),
  ]);

  return {
    stats: {
      collectionCount,
      savedImagesCount,
      unlockedAlbumsCount,
      favoritesCount,
    },
    recentAccesses,
  };
}

export async function getAdminDashboardData() {
  const [
    [{ value: totalUsers }],
    [{ value: photographers }],
    [{ value: clientsCount }],
    [{ value: admins }],
    [{ value: totalAlbums }],
    [{ value: totalImages }],
    [{ value: totalAccesses }],
    [{ value: totalFavorites }],
    [{ value: totalLeads }],
    recentUsers,
    recentAlbums,
    recentAccesses,
  ] = await Promise.all([
    db.select({ value: count() }).from(users),
    db
      .select({ value: count() })
      .from(users)
      .where(eq(users.role, "photographer")),
    db
      .select({ value: count() })
      .from(users)
      .where(eq(users.role, "client")),
    db
      .select({ value: count() })
      .from(users)
      .where(
        or(eq(users.role, "admin"), eq(users.role, "super_admin")),
      ),
    db.select({ value: count() }).from(albums),
    db.select({ value: count() }).from(images),
    db.select({ value: count() }).from(albumAccesses),
    db.select({ value: count() }).from(favorites),
    db.select({ value: count() }).from(leads),
    db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        isAnonymous: true,
        createdAt: true,
      },
      orderBy: (user, { desc }) => [desc(user.createdAt)],
      limit: 6,
    }),
    db.query.albums.findMany({
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        clientRecord: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: (album, { desc }) => [desc(album.updatedAt)],
      limit: 6,
    }),
    db.query.albumAccesses.findMany({
      with: {
        album: {
          columns: {
            id: true,
            title: true,
            slug: true,
            visibility: true,
          },
        },
      },
      orderBy: (access, { desc }) => [desc(access.lastAccessedAt)],
      limit: 8,
    }),
  ]);

  return {
    stats: {
      totalUsers,
      photographers,
      clientsCount,
      admins,
      totalAlbums,
      totalImages,
      totalAccesses,
      totalFavorites,
      totalLeads,
    },
    recentUsers,
    recentAlbums,
    recentAccesses,
  };
}
