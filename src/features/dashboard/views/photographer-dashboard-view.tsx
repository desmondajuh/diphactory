import Link from "next/link";
import {
  ContactRoundIcon,
  FolderKanbanIcon,
  GlobeIcon,
  HeartIcon,
  ImagesIcon,
  InboxIcon,
  KeyRoundIcon,
  PlusIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPhotographerDashboardData } from "@/lib/dashboard";
import { DashboardShell } from "../components/dashboard-shell";
import { DashboardStatCard } from "../components/dashboard-stat-card";

function formatDate(value: Date | null) {
  if (!value) {
    return "Recently updated";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

interface PhotographerDashboardViewProps {
  userId: string;
}

export async function PhotographerDashboardView({
  userId,
}: PhotographerDashboardViewProps) {
  const data = await getPhotographerDashboardData(userId);

  return (
    <DashboardShell
      eyebrow="Photographer Dashboard"
      title="Run your studio from one calm, client-ready workspace."
      description="Track galleries, uploads, client access, and selections from the same place you prepare every delivery experience."
      actions={
        <>
          <Button asChild>
            <Link href="/dashboard/albums">
              <FolderKanbanIcon className="size-4" />
              Manage albums
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/album">
              <GlobeIcon className="size-4" />
              Shared album entry
            </Link>
          </Button>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Client Albums"
          value={data.stats.totalAlbums}
          helper={`${data.stats.privateAlbums} private and ${data.stats.publicAlbums} public galleries`}
          icon={FolderKanbanIcon}
        />
        <DashboardStatCard
          label="Uploaded Images"
          value={data.stats.totalImages}
          helper="All images currently available across your managed galleries"
          icon={ImagesIcon}
        />
        <DashboardStatCard
          label="Gallery Access"
          value={data.stats.totalAccesses}
          helper="Every verified entry into your public and private album links"
          icon={KeyRoundIcon}
        />
        <DashboardStatCard
          label="Favorites Picked"
          value={data.stats.totalFavorites}
          helper={`${data.stats.totalLeads} captured leads are also tied to your shared galleries`}
          icon={HeartIcon}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border border-border/70 bg-card/80 py-0">
          <CardHeader className="border-b border-border/70 py-5">
            <CardTitle>Recent delivery-ready galleries</CardTitle>
            <CardDescription>
              The albums most likely to need your next upload, tweak, or share link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {data.recentAlbums.length > 0 ? (
              data.recentAlbums.map((album) => (
                <Link
                  key={album.id}
                  href={`/dashboard/albums/${album.id}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/50 px-4 py-3 transition hover:border-foreground/20 hover:bg-background"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{album.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {album.clientRecord?.name ??
                        album.clientRecord?.email ??
                        "No linked client yet"}
                    </p>
                  </div>
                  <div className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <p>{album.visibility}</p>
                    <p>{album.albumImages.length} image slots in use</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/40 p-6 text-sm text-muted-foreground">
                No galleries yet. Create the first album and start shaping the client delivery flow.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border border-border/70 bg-card/80 py-0">
            <CardHeader className="border-b border-border/70 py-5">
              <CardTitle>Quick routes</CardTitle>
              <CardDescription>
                The places you will likely jump between while preparing a delivery.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 p-5">
              <Button variant="outline" asChild className="justify-start">
                <Link href="/dashboard/albums">
                  <FolderKanbanIcon className="size-4" />
                  Open album manager
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/gallery">
                  <ImagesIcon className="size-4" />
                  Review public portfolio
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/dashboard/clients">
                  <ContactRoundIcon className="size-4" />
                  Manage clients
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/dashboard/leads">
                  <InboxIcon className="size-4" />
                  Review leads
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href="/album">
                  <GlobeIcon className="size-4" />
                  Shared gallery entry page
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/80 py-0">
            <CardHeader className="border-b border-border/70 py-5">
              <CardTitle>What this app is optimizing for</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <SparklesIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
                <p>Private galleries can be restricted by client email and access code.</p>
              </div>
              <div className="flex items-start gap-3">
                <UsersIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
                <p>Public galleries can capture leads before viewers browse your images.</p>
              </div>
              <div className="flex items-start gap-3">
                <PlusIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
                <p>Favorites and access activity give you a cleaner handoff after every shoot.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardStatCard
          label="Public Galleries"
          value={data.stats.publicAlbums}
          helper="Lead-friendly album links that open after visitor details are captured"
          icon={GlobeIcon}
        />
        <DashboardStatCard
          label="Private Galleries"
          value={data.stats.privateAlbums}
          helper="Albums protected with invite email validation and a delivery code"
          icon={KeyRoundIcon}
        />
        <Card className="border border-border/70 bg-card/80 py-0">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Last Movement
            </p>
            <p className="text-2xl font-semibold tracking-tight">
              {formatDate(data.recentAlbums[0]?.updatedAt ?? null)}
            </p>
            <p className="text-sm text-muted-foreground">
              Your latest gallery activity is visible here so you can continue work without hunting for the right album.
            </p>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}
