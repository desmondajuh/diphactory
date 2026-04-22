"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarDaysIcon,
  EyeIcon,
  FolderHeartIcon,
  Link2Icon,
  SearchIcon,
} from "lucide-react";
import { client } from "@/lib/orpc";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DashboardAlbumsListProps {
  refreshKey?: number;
}

type AlbumListItem = Awaited<ReturnType<typeof client.albums.list>>[number];

export const DashboardAlbumsList = ({
  refreshKey = 0,
}: DashboardAlbumsListProps) => {
  const [albums, setAlbums] = useState<AlbumListItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAlbums() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await client.albums.list();
        if (active) {
          setAlbums(data);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load albums right now.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadAlbums();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const filteredAlbums = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return albums;
    }

    return albums.filter((album) => {
      const clientName = album.clientRecord?.name?.toLowerCase() ?? "";
      const clientEmail = album.clientRecord?.email?.toLowerCase() ?? "";

      return (
        album.title.toLowerCase().includes(query) ||
        album.slug.toLowerCase().includes(query) ||
        (album.description?.toLowerCase().includes(query) ?? false) ||
        clientName.includes(query) ||
        clientEmail.includes(query)
      );
    });
  }, [albums, search]);

  return (
    <div className="flex w-full flex-1 flex-col gap-5">
      <div className="relative w-full max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by title, slug, or client"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border border-border/70 bg-card/80">
              <CardHeader>
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-52" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border border-destructive/30 bg-destructive/5">
          <CardContent className="py-10 text-sm text-muted-foreground">
            {error}
          </CardContent>
        </Card>
      ) : filteredAlbums.length === 0 ? (
        <Card className="border border-dashed border-border/70 bg-card/70">
          <CardContent className="flex flex-col items-start gap-3 py-10">
            <p className="text-lg font-medium">No albums yet</p>
            <p className="max-w-xl text-sm text-muted-foreground">
              Create your first shoot album to start sharing galleries with
              clients and collecting favorites.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredAlbums.map((album) => {
            const sharedUrl =
              typeof window === "undefined"
                ? `/album/${album.slug}`
                : `${window.location.origin}/album/${album.slug}`;

            return (
              <Link key={album.id} href={`/dashboard/albums/${album.id}`}>
                <Card className="h-full border border-border/70 bg-card/90 transition-all hover:-translate-y-0.5 hover:border-foreground/20">
                  <CardHeader className="gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{album.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {album.description ||
                            "A curated gallery ready to be shared with your client."}
                        </CardDescription>
                      </div>
                      <StatusPill visibility={album.visibility} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoTile
                        icon={FolderHeartIcon}
                        label="Images"
                        value={`${album.albumImages.length} linked`}
                      />
                      <InfoTile
                        icon={EyeIcon}
                        label="Audience"
                        value={
                          album.clientRecord?.name ??
                          album.clientRecord?.email ??
                          "Open sharing"
                        }
                      />
                      <InfoTile
                        icon={Link2Icon}
                        label="Share link"
                        value={sharedUrl.replace(/^https?:\/\//, "")}
                        compact
                      />
                      <InfoTile
                        icon={CalendarDaysIcon}
                        label="Created"
                        value={format(new Date(album.createdAt), "MMM d, yyyy")}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span className="truncate">Slug: {album.slug}</span>
                      <span className="shrink-0">
                        {album.visibility === "private"
                          ? "Email + code required"
                          : "Lead capture enabled"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

function InfoTile({
  icon: Icon,
  label,
  value,
  compact = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/35 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Icon className="size-3.5" />
        <span>{label}</span>
      </div>
      <p className={cn("text-sm font-medium", compact && "truncate")}>{value}</p>
    </div>
  );
}

function StatusPill({ visibility }: { visibility: "public" | "private" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]",
        visibility === "private"
          ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
          : "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
      )}
    >
      {visibility}
    </span>
  );
}
