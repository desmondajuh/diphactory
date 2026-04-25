"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  CheckCheckIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  KeyRoundIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
  Globe2Icon,
  ImagesIcon,
  Trash2Icon,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { AlbumImageUploader } from "./album-image-uploader";
import Image from "next/image";

interface AlbumIdDetailsProps {
  albumId: string;
  refreshKey?: number;
  onLoaded?: (albumTitle: string) => void;
}

type AlbumDetails = Awaited<ReturnType<typeof client.albums.getById>>;

export const AlbumIdDetails = ({
  albumId,
  refreshKey = 0,
  onLoaded,
}: AlbumIdDetailsProps) => {
  const [album, setAlbum] = useState<AlbumDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [revealedCode, setRevealedCode] = useState<string | null>(null);
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAlbum() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await client.albums.getById({ albumId });
        if (active) {
          setAlbum(data);
          onLoaded?.(data.title);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load album details.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadAlbum();

    return () => {
      active = false;
    };
  }, [albumId, onLoaded, refreshKey]);

  useEffect(() => {
    setRevealedCode(album?.accessCodePlain ?? null);
    setIsCodeVisible(false);
  }, [album?.accessCodePlain]);

  const sharedUrl = useMemo(() => {
    if (!album) {
      return "";
    }

    if (typeof window === "undefined") {
      return `/album/${album.slug}`;
    }

    return `${window.location.origin}/album/${album.slug}`;
  }, [album]);

  if (isLoading) {
    return (
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border border-border/70 bg-card/90">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
        <Card className="border border-border/70 bg-card/90">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !album) {
    return (
      <Card className="border border-destructive/30 bg-destructive/5">
        <CardContent className="py-10 text-sm text-muted-foreground">
          {error ?? "Album details could not be loaded."}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-4">
        <Card className="border border-border/70 bg-card/90">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-2xl">{album.title}</CardTitle>
                <CardDescription>
                  {album.description ||
                    "This gallery is ready for your next upload and client review round."}
                </CardDescription>
              </div>
              <span
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]",
                  album.visibility === "private"
                    ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
                    : "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
                )}
              >
                {album.visibility}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailTile
                icon={ImagesIcon}
                label="Images linked"
                value={`${album.albumImages.length}`}
              />
              <DetailTile
                icon={
                  album.visibility === "private" ? LockKeyholeIcon : Globe2Icon
                }
                label="Viewing mode"
                value={
                  album.visibility === "private"
                    ? "Email + access code"
                    : "Lead capture before viewing"
                }
              />
              <DetailTile
                icon={MailIcon}
                label="Client"
                value={
                  album.clientRecord?.name ??
                  album.clientRecord?.email ??
                  "No specific client linked"
                }
              />
              <DetailTile
                icon={KeyRoundIcon}
                label="Created"
                value={format(new Date(album.createdAt), "MMM d, yyyy")}
              />
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">Share this gallery link</p>
                  <p className="text-sm text-muted-foreground">
                    Use this exact URL when sending the gallery to your client.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await navigator.clipboard.writeText(sharedUrl);
                    toast.success("Gallery link copied.");
                  }}
                >
                  <CopyIcon className="size-4" />
                  Copy link
                </Button>
              </div>
              <div className="rounded-xl bg-background/80 px-3 py-2 text-sm text-muted-foreground ring-1 ring-border/70">
                {sharedUrl}
              </div>
            </div>

            {album.visibility === "private" && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">Private access code</p>
                    <p className="text-sm text-muted-foreground">
                      The current code is stored for managers going forward.
                      Older albums may need one fresh regeneration before the
                      code can be shown here.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      disabled={!revealedCode}
                      onClick={() => setIsCodeVisible((current) => !current)}
                    >
                      {isCodeVisible ? (
                        <>
                          <EyeOffIcon className="size-4" />
                          Hide code
                        </>
                      ) : (
                        <>
                          <EyeIcon className="size-4" />
                          Reveal code
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={!revealedCode}
                      onClick={async () => {
                        if (!revealedCode) return;
                        await navigator.clipboard.writeText(revealedCode);
                        toast.success("Access code copied.");
                      }}
                    >
                      <CopyIcon className="size-4" />
                      Copy code
                    </Button>
                    <Button
                      variant="outline"
                      disabled={isRegenerating}
                      onClick={async () => {
                        setIsRegenerating(true);
                        try {
                          const result = await client.albums.regenerateCode({
                            albumId: album.id,
                          });
                          setRevealedCode(result.plainCode);
                          setIsCodeVisible(true);
                          setAlbum((current) =>
                            current
                              ? {
                                  ...current,
                                  accessCodePlain: result.plainCode,
                                }
                              : current,
                          );
                          toast.success(`New access code: ${result.plainCode}`);
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "Could not regenerate the code.",
                          );
                        } finally {
                          setIsRegenerating(false);
                        }
                      }}
                    >
                      {isRegenerating ? (
                        <>
                          <LoaderCircleIcon className="size-4 animate-spin" />
                          Regenerating
                        </>
                      ) : (
                        <>
                          <KeyRoundIcon className="size-4" />
                          Regenerate code
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl bg-background/80 px-3 py-3 ring-1 ring-border/70">
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Current private code
                  </p>
                  <p className="font-mono text-lg font-semibold tracking-[0.28em]">
                    {revealedCode
                      ? isCodeVisible
                        ? revealedCode
                        : "••••••"
                      : "Not yet available for this older album"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-card/90">
          <CardHeader>
            <CardTitle>Upload and manage album images</CardTitle>
            <CardDescription>
              Upload new files straight into this album, or remove images that
              should no longer appear in the gallery.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-2">
              <AlbumImageUploader
                onUploaded={async (imageIds) => {
                  await client.images.addToAlbum({ albumId, imageIds });
                  const data = await client.albums.getById({ albumId });
                  setAlbum(data);
                  onLoaded?.(data.title);
                  toast.success(
                    `${imageIds.length} image${imageIds.length === 1 ? "" : "s"} added to album.`,
                  );
                }}
              />
            </div>

            {album.albumImages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-6 text-sm text-muted-foreground">
                This album is still empty. Uploading here will attach new images
                directly to the client gallery.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {album.albumImages.map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/20 w-1/3 aspect-4/3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Image
                      src={item.image.thumbnailUrl || item.image.utUrl}
                      alt={item.image.filename}
                      fill
                      className="aspect-4/3 h-full w-full object-cover"
                    />
                    <div className="space-y-3 p-3">
                      <div>
                        <p className="truncate text-sm font-medium">
                          {item.image.filename}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Position {item.sortOrder + 1}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={removingImageId === item.image.id}
                        onClick={async () => {
                          setRemovingImageId(item.image.id);
                          try {
                            const result = await client.images.removeFromAlbum({
                              albumId,
                              imageId: item.image.id,
                            });
                            setAlbum((current) =>
                              current
                                ? {
                                    ...current,
                                    albumImages: current.albumImages.filter(
                                      (albumImage) =>
                                        albumImage.image.id !== item.image.id,
                                    ),
                                  }
                                : current,
                            );
                            toast.success(
                              result.deletedAsset
                                ? "Image removed from album and deleted from storage."
                                : "Image removed from album.",
                            );
                          } catch (error) {
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : "Could not remove the image from this album.",
                            );
                          } finally {
                            setRemovingImageId(null);
                          }
                        }}
                      >
                        {removingImageId === item.image.id ? (
                          <>
                            <LoaderCircleIcon className="size-4 animate-spin" />
                            Removing
                          </>
                        ) : (
                          <>
                            <Trash2Icon className="size-4" />
                            Remove from album
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border/70 bg-card/90">
        <CardHeader>
          <CardTitle>Gallery preview</CardTitle>
          <CardDescription>
            A quick look at what the client will browse once the album is
            unlocked.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {album.albumImages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-6 text-sm text-muted-foreground">
              No images have been attached yet. Upload to this album next so the
              gallery becomes client-ready.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {album.albumImages.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-border/60 bg-muted/20"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image.thumbnailUrl || item.image.utUrl}
                    alt={item.image.filename}
                    className="aspect-[4/3] h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <CheckCheckIcon className="size-4 text-emerald-400" />
              Client experience checklist
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Share link is ready.</li>
              <li>Favorites will be tracked per visitor access session.</li>
              <li>
                Clients with accounts can later save approved images into their
                own collections.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function DetailTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/30 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="size-3.5" />
        <span>{label}</span>
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
