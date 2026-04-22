"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  HeartIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { client } from "@/lib/orpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SharedAlbumMeta = Awaited<ReturnType<typeof client.albums.getSharedBySlug>>;
type SharedAlbumItems = Awaited<
  ReturnType<typeof client.images.listAccessibleAlbum>
>;

interface SharedAlbumViewProps {
  slug: string;
}

export const SharedAlbumView = ({ slug }: SharedAlbumViewProps) => {
  const [album, setAlbum] = useState<SharedAlbumMeta | null>(null);
  const [isLoadingAlbum, setIsLoadingAlbum] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [accessId, setAccessId] = useState<string | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const [gallery, setGallery] = useState<SharedAlbumItems | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessId =
      typeof window === "undefined"
        ? null
        : window.sessionStorage.getItem(`album-access:${slug}`);

    if (storedAccessId) {
      setAccessId(storedAccessId);
    }
  }, [slug]);

  useEffect(() => {
    let active = true;

    async function loadMeta() {
      setIsLoadingAlbum(true);
      setMetaError(null);

      try {
        const data = await client.albums.getSharedBySlug({ slug });
        if (active) {
          setAlbum(data);
        }
      } catch (error) {
        if (active) {
          setMetaError(
            error instanceof Error
              ? error.message
              : "This album could not be found.",
          );
        }
      } finally {
        if (active) {
          setIsLoadingAlbum(false);
        }
      }
    }

    void loadMeta();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;

    async function loadGallery() {
      if (!accessId) {
        return;
      }

      setIsLoadingGallery(true);

      try {
        const [galleryData, favoriteData] = await Promise.all([
          client.images.listAccessibleAlbum({ slug, accessId }),
          client.favorites.list({ accessId }),
        ]);

        if (active) {
          setGallery(galleryData);
          setFavorites(new Set(favoriteData.map((item) => item.image.id)));
          setActiveImageId((current) => current ?? galleryData.items[0]?.image.id ?? null);
        }
      } catch (error) {
        if (active) {
          if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(`album-access:${slug}`);
          }
          setAccessId(null);
          toast.error(
            error instanceof Error
              ? error.message
              : "This album session is no longer valid.",
          );
        }
      } finally {
        if (active) {
          setIsLoadingGallery(false);
        }
      }
    }

    void loadGallery();

    return () => {
      active = false;
    };
  }, [accessId, slug]);

  const activeImage = useMemo(
    () =>
      gallery?.items.find((item) => item.image.id === activeImageId)?.image ??
      gallery?.items[0]?.image ??
      null,
    [activeImageId, gallery],
  );

  async function authorize() {
    if (!album) {
      return;
    }

    if (!email.trim()) {
      toast.error("Enter your email to continue.");
      return;
    }

    setIsAuthorizing(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const result =
        album.visibility === "private"
          ? await client.access.unlockPrivate({
              slug,
              email: normalizedEmail,
              code: code.trim().toUpperCase(),
            })
          : await client.access.capturePublicVisitor({
              slug,
              email: normalizedEmail,
              name: name.trim() || undefined,
            });

      setAccessId(result.accessId);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(`album-access:${slug}`, result.accessId);
      }
      toast.success("Album unlocked.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not unlock album.",
      );
    } finally {
      setIsAuthorizing(false);
    }
  }

  async function toggleFavorite(imageId: string) {
    if (!accessId) {
      return;
    }

    const next = await client.favorites.toggle({ accessId, imageId });
    setFavorites((current) => {
      const draft = new Set(current);
      if (next.favorited) {
        draft.add(imageId);
      } else {
        draft.delete(imageId);
      }
      return draft;
    });
  }

  if (isLoadingAlbum) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
        <Skeleton className="h-64 w-full rounded-[2rem]" />
        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <Skeleton className="h-72 w-full rounded-[2rem]" />
          <Skeleton className="h-72 w-full rounded-[2rem]" />
        </div>
      </div>
    );
  }

  if (metaError || !album) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 py-8">
        <Card className="w-full border border-destructive/30 bg-destructive/5">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {metaError ?? "Album not found."}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_45%),linear-gradient(180deg,_rgba(10,10,10,0.98),_rgba(25,25,25,0.96))] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:py-12">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5 p-6 md:p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/70">
                <SparklesIcon className="size-3.5" />
                {album.visibility === "private"
                  ? "Private Client Gallery"
                  : "Public Showcase Gallery"}
              </div>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                  {album.title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-white/70 md:text-base">
                  {album.description ||
                    "A curated selection of photographs from the shoot, arranged for a calm review and selection experience."}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/70">
                <MetaChip icon={MailIcon}>
                  {album.clientName ? `Prepared for ${album.clientName}` : "Client-ready sharing"}
                </MetaChip>
                <MetaChip icon={HeartIcon}>
                  Mark favorites as you review
                </MetaChip>
                <MetaChip icon={ShieldCheckIcon}>
                  {album.visibility === "private"
                    ? "Email and code protected"
                    : "Email required before entry"}
                </MetaChip>
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/20 p-6 md:p-8 lg:border-l lg:border-t-0">
              {!accessId ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-medium">
                      {album.visibility === "private"
                        ? "Unlock your gallery"
                        : "Enter your details to view"}
                    </h2>
                    <p className="text-sm text-white/65">
                      {album.visibility === "private"
                        ? "Use the email and access code the photographer sent you."
                        : "We’ll ask for your email before opening this gallery."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/35"
                    />

                    {album.visibility === "public" ? (
                      <Input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your name"
                        className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/35"
                      />
                    ) : (
                      <Input
                        value={code}
                        onChange={(event) => setCode(event.target.value.toUpperCase())}
                        placeholder="Access code"
                        className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/35"
                      />
                    )}
                  </div>

                  <Button
                    onClick={() => void authorize()}
                    disabled={isAuthorizing}
                    className="h-11 w-full bg-white text-black hover:bg-white/90"
                  >
                    {isAuthorizing ? (
                      <>
                        <LoaderCircleIcon className="size-4 animate-spin" />
                        Opening gallery
                      </>
                    ) : album.visibility === "private" ? (
                      <>
                        <LockKeyholeIcon className="size-4" />
                        Unlock gallery
                      </>
                    ) : (
                      "Continue to gallery"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                    Access granted. You can now browse the gallery and mark your
                    favorite images.
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-white/15 bg-transparent text-white hover:bg-white/8 hover:text-white"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.sessionStorage.removeItem(`album-access:${slug}`);
                      }
                      setAccessId(null);
                      setGallery(null);
                    }}
                  >
                    Switch email or re-enter code
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {accessId && (
          <section className="grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
                {isLoadingGallery ? (
                  <Skeleton className="aspect-[16/10] w-full rounded-none bg-white/10" />
                ) : activeImage ? (
                  <div className="space-y-4 p-4 md:p-5">
                    <div className="overflow-hidden rounded-[1.5rem] bg-black/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeImage.utUrl}
                        alt={activeImage.filename}
                        className="aspect-[16/10] w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-white/55">Viewing image</p>
                        <p className="font-medium">{activeImage.filename}</p>
                      </div>
                      <Button
                        variant="outline"
                        className={cn(
                          "border-white/15 bg-transparent text-white hover:bg-white/8 hover:text-white",
                          favorites.has(activeImage.id) &&
                            "border-rose-400/35 bg-rose-400/10 text-rose-100",
                        )}
                        onClick={() => void toggleFavorite(activeImage.id)}
                      >
                        <HeartIcon
                          className={cn(
                            "size-4",
                            favorites.has(activeImage.id) && "fill-current",
                          )}
                        />
                        {favorites.has(activeImage.id)
                          ? "Favorited"
                          : "Add to favorites"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-sm text-white/60">
                    This album does not have any images yet.
                  </div>
                )}
              </div>

              {gallery && gallery.items.length > 0 && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                  {gallery.items.map((item) => {
                    const isActive = item.image.id === activeImage?.id;
                    const isFavorite = favorites.has(item.image.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveImageId(item.image.id)}
                        className={cn(
                          "group relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.03] text-left transition",
                          isActive && "border-white/35 ring-2 ring-white/20",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image.thumbnailUrl || item.image.utUrl}
                          alt={item.image.filename}
                          className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3">
                          <span className="max-w-[80%] truncate text-xs text-white/80">
                            {item.image.filename}
                          </span>
                          <HeartIcon
                            className={cn(
                              "size-4 text-white/80",
                              isFavorite && "fill-current text-rose-300",
                            )}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Card className="border border-white/10 bg-white/[0.04] text-white shadow-none">
                <CardContent className="space-y-4 py-6">
                  <div>
                    <p className="text-sm text-white/55">Favorites picked</p>
                    <p className="text-3xl font-semibold">{favorites.size}</p>
                  </div>
                  <Textarea
                    readOnly
                    value={
                      favorites.size > 0
                        ? "Keep browsing and tap the heart icon on any image you want the photographer to prioritize."
                        : "No favorites yet. Start reviewing the gallery and tap the heart icon on the images you love."
                    }
                    className="min-h-32 border-white/10 bg-black/20 text-white/80"
                  />
                </CardContent>
              </Card>

              <Card className="border border-white/10 bg-white/[0.04] text-white shadow-none">
                <CardContent className="space-y-3 py-6">
                  <p className="text-sm font-medium">How this review works</p>
                  <div className="space-y-2 text-sm text-white/65">
                    <p>1. Open any image to preview it larger.</p>
                    <p>2. Tap the heart to save it to your favorites.</p>
                    <p>3. The photographer can see your choices tied to this gallery access.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

function MetaChip({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
      <Icon className="size-3.5" />
      {children}
    </span>
  );
}
