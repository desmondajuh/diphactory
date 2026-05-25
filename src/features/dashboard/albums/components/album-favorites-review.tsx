"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  DownloadIcon,
  HeartIcon,
  MailIcon,
  RefreshCwIcon,
  UserCheckIcon,
} from "lucide-react";
import { toast } from "sonner";
import { client } from "@/lib/orpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AlbumFavoritesReviewProps {
  albumId: string;
  refreshKey?: number;
}

type FavoriteAccessGroup = Awaited<
  ReturnType<typeof client.favorites.listByAlbum>
>[number];

export function AlbumFavoritesReview({
  albumId,
  refreshKey = 0,
}: AlbumFavoritesReviewProps) {
  const [groups, setGroups] = useState<FavoriteAccessGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFavorites() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await client.favorites.listByAlbum({ albumId });
        if (active) {
          setGroups(data);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load client selections.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadFavorites();

    return () => {
      active = false;
    };
  }, [albumId, refreshKey]);

  const groupsWithFavorites = useMemo(
    () => groups.filter((group) => group.favorites.length > 0),
    [groups],
  );

  const totalFavorites = useMemo(
    () => groups.reduce((count, group) => count + group.favorites.length, 0),
    [groups],
  );

  const uniqueImageCount = useMemo(
    () =>
      new Set(
        groups.flatMap((group) =>
          group.favorites.map((favorite) => favorite.imageId),
        ),
      ).size,
    [groups],
  );

  function copySelectionList(group: FavoriteAccessGroup) {
    const list = group.favorites
      .map((favorite, index) => `${index + 1}. ${favorite.image.filename}`)
      .join("\n");

    void navigator.clipboard.writeText(list);
    toast.success("Selection list copied.");
  }

  if (isLoading) {
    return (
      <Card className="border border-border/70 bg-card/90">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-destructive/30 bg-destructive/5">
        <CardContent className="py-10 text-sm text-muted-foreground">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/70 bg-card/90">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>Client selections</CardTitle>
            <CardDescription>
              See which images each album visitor favorited for editing or
              delivery priority.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              setIsLoading(true);
              try {
                const data = await client.favorites.listByAlbum({ albumId });
                setGroups(data);
              } catch (loadError) {
                toast.error(
                  loadError instanceof Error
                    ? loadError.message
                    : "Could not refresh selections.",
                );
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <RefreshCwIcon className="size-4" />
            Refresh selections
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          <SelectionStat
            icon={UserCheckIcon}
            label="Visitors"
            value={`${groups.length}`}
          />
          <SelectionStat
            icon={HeartIcon}
            label="Favorites"
            value={`${totalFavorites}`}
          />
          <SelectionStat
            icon={DownloadIcon}
            label="Unique files"
            value={`${uniqueImageCount}`}
          />
        </div>

        {groups.length === 0 ? (
          <EmptySelectionState message="No client has opened this album yet. Once a client unlocks the gallery, their access session will appear here." />
        ) : groupsWithFavorites.length === 0 ? (
          <EmptySelectionState message="Clients have opened this album, but no one has favorited an image yet." />
        ) : (
          <div className="space-y-4">
            {groupsWithFavorites.map((group) => (
              <div
                key={group.id}
                className="rounded-2xl border border-border/60 bg-muted/20 p-4"
              >
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MailIcon className="size-4 text-muted-foreground" />
                      {group.visitorEmail}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {group.favorites.length} selected · Last opened{" "}
                      {format(new Date(group.lastAccessedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copySelectionList(group)}
                  >
                    <DownloadIcon className="size-3.5" />
                    Copy filenames
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-4">
                  {group.favorites.map((favorite) => (
                    <div
                      key={favorite.id}
                      className="overflow-hidden rounded-xl border border-border/60 bg-background/70"
                    >
                      <div className="relative aspect-[4/3] bg-muted">
                        <Image
                          src={
                            favorite.image.thumbnailUrl ||
                            favorite.image.utUrl
                          }
                          alt={favorite.image.filename}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1536px) 20vw, (min-width: 768px) 30vw, 50vw"
                        />
                        <div className="absolute right-2 top-2 rounded-full bg-background/85 p-1.5 text-rose-500 shadow-sm">
                          <HeartIcon className="size-3.5 fill-current" />
                        </div>
                      </div>
                      <div className="space-y-1 p-3">
                        <p className="truncate text-sm font-medium">
                          {favorite.image.filename}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Selected{" "}
                          {format(new Date(favorite.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SelectionStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/35 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Icon className="size-3.5" />
        <span>{label}</span>
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function EmptySelectionState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-6 text-sm text-muted-foreground">
      {message}
    </div>
  );
}
