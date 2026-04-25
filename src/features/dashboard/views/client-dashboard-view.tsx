import Link from "next/link";
import {
  AlbumIcon,
  HeartIcon,
  ImagesIcon,
  KeyRoundIcon,
  LayoutGridIcon,
  Link2Icon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getClientDashboardData } from "@/lib/dashboard";
import { DashboardShell } from "../components/dashboard-shell";
import { DashboardStatCard } from "../components/dashboard-stat-card";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

interface ClientDashboardViewProps {
  userId: string;
  email: string;
  isAnonymous?: boolean;
}

export async function ClientDashboardView({
  userId,
  email,
  isAnonymous = false,
}: ClientDashboardViewProps) {
  const data = await getClientDashboardData(userId, email);

  return (
    <DashboardShell
      eyebrow={isAnonymous ? "Guest Gallery Space" : "Client Dashboard"}
      title={
        isAnonymous
          ? "Browse shared galleries without the extra dashboard clutter."
          : "A cleaner place to review galleries, favorites, and saved selections."
      }
      description="This account experience is centered on viewing albums, opening shared links, favoriting the right images, and returning to galleries you already unlocked."
      actions={
        <>
          <Button asChild>
            <Link href="/album">
              <Link2Icon className="size-4" />
              Open album link
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/gallery">
              <ImagesIcon className="size-4" />
              Browse portfolio
            </Link>
          </Button>
        </>
      }
      className="mx-auto max-w-7xl"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Unlocked Albums"
          value={data.stats.unlockedAlbumsCount}
          helper="Albums you have already opened with your email or account"
          icon={KeyRoundIcon}
        />
        <DashboardStatCard
          label="Favorites"
          value={data.stats.favoritesCount}
          helper="Images you marked while reviewing client or public galleries"
          icon={HeartIcon}
        />
        <DashboardStatCard
          label="Collections"
          value={data.stats.collectionCount}
          helper="Private collection albums connected to your account"
          icon={AlbumIcon}
        />
        <DashboardStatCard
          label="Saved Images"
          value={data.stats.savedImagesCount}
          helper="Images already added into your personal collection albums"
          icon={LayoutGridIcon}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border border-border/70 bg-card/80 py-0">
          <CardHeader className="border-b border-border/70 py-5">
            <CardTitle>Recent galleries you accessed</CardTitle>
            <CardDescription>
              Re-open galleries quickly without digging through old messages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {data.recentAccesses.length > 0 ? (
              data.recentAccesses.map((access) => (
                <Link
                  key={access.id}
                  href={`/album/${access.album.slug}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/50 px-4 py-3 transition hover:border-foreground/20 hover:bg-background"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{access.album.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Last opened on {formatDate(access.lastAccessedAt)}
                    </p>
                  </div>
                  <div className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <p>{access.album.visibility}</p>
                    <p>{access.album.isActive ? "available" : "inactive"}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/40 p-6 text-sm text-muted-foreground">
                No unlocked galleries yet. Open a shared album link to start reviewing images and saving favorites.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border border-border/70 bg-card/80 py-0">
            <CardHeader className="border-b border-border/70 py-5">
              <CardTitle>Important links</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 p-5">
              <Button variant="outline" asChild className="justify-start">
                <Link href="/album">
                  <Link2Icon className="size-4" />
                  Album entry page
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/gallery">
                  <ImagesIcon className="size-4" />
                  Public gallery
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/contact">
                  <SparklesIcon className="size-4" />
                  Contact the studio
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/80 py-0">
            <CardHeader className="border-b border-border/70 py-5">
              <CardTitle>How this side of the app works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 text-sm text-muted-foreground">
              <p>1. Open the gallery link the photographer shared with you.</p>
              <p>2. Enter your email or access code when prompted.</p>
              <p>3. Mark the images you love and return to the gallery anytime from here.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </DashboardShell>
  );
}
