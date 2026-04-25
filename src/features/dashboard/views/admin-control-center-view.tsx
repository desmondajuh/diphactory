import Link from "next/link";
import {
  CalendarDaysIcon,
  CameraIcon,
  FolderKanbanIcon,
  ImagesIcon,
  KeyRoundIcon,
  ShieldCheckIcon,
  UserRoundIcon,
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
import { getAdminDashboardData } from "@/lib/dashboard";
import { DashboardShell } from "../components/dashboard-shell";
import { DashboardStatCard } from "../components/dashboard-stat-card";

function formatDate(value: Date | null) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

interface AdminControlCenterViewProps {
  isSuperAdmin: boolean;
}

export async function AdminControlCenterView({
  isSuperAdmin,
}: AdminControlCenterViewProps) {
  const data = await getAdminDashboardData();

  return (
    <DashboardShell
      eyebrow={isSuperAdmin ? "Super Admin Control Center" : "Admin Overview"}
      title={
        isSuperAdmin
          ? "See the entire platform in one unrestricted control room."
          : "Monitor the platform health, user growth, and gallery activity."
      }
      description="This page is tuned to the actual product model: photographers publish and deliver albums, viewers unlock galleries, and favorites plus access logs show real engagement."
      actions={
        <>
          <Button asChild>
            <Link href="/dashboard/admin">
              <ShieldCheckIcon className="size-4" />
              Control center
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <FolderKanbanIcon className="size-4" />
              Dashboard home
            </Link>
          </Button>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Users"
          value={data.stats.totalUsers}
          helper={`${data.stats.photographers} photographers, ${data.stats.clientsCount} clients`}
          icon={UsersIcon}
        />
        <DashboardStatCard
          label="Albums"
          value={data.stats.totalAlbums}
          helper="All shoot galleries and private client collections"
          icon={FolderKanbanIcon}
        />
        <DashboardStatCard
          label="Images"
          value={data.stats.totalImages}
          helper="Uploaded assets currently available inside the platform"
          icon={ImagesIcon}
        />
        <DashboardStatCard
          label="Access Events"
          value={data.stats.totalAccesses}
          helper={`${data.stats.totalFavorites} favorites and ${data.stats.totalLeads} leads recorded`}
          icon={KeyRoundIcon}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border border-border/70 bg-card/80 py-0">
          <CardHeader className="border-b border-border/70 py-5">
            <CardTitle>Recent users</CardTitle>
            <CardDescription>
              A quick pulse on who is joining and which role mix is forming.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {data.recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/50 px-4 py-3"
              >
                <div className="space-y-1">
                  <p className="font-medium">{user.name ?? "Unnamed user"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <p>{user.isAnonymous ? "guest" : user.role}</p>
                  <p>{formatDate(user.createdAt)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-card/80 py-0">
          <CardHeader className="border-b border-border/70 py-5">
            <CardTitle>Recent albums</CardTitle>
            <CardDescription>
              The latest galleries created or updated across the whole platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {data.recentAlbums.map((album) => (
              <div
                key={album.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/50 px-4 py-3"
              >
                <div className="space-y-1">
                  <p className="font-medium">{album.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {album.owner.name ?? album.owner.email}
                  </p>
                </div>
                <div className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <p>{album.type}</p>
                  <p>{album.visibility}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border border-border/70 bg-card/80 py-0">
          <CardHeader className="border-b border-border/70 py-5">
            <CardTitle>Latest gallery access activity</CardTitle>
            <CardDescription>
              The clearest signal that shared galleries are being opened and reviewed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {data.recentAccesses.map((access) => (
              <div
                key={access.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/50 px-4 py-3"
              >
                <div className="space-y-1">
                  <p className="font-medium">{access.album.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {access.visitorEmail}
                  </p>
                </div>
                <div className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <p>{access.album.visibility}</p>
                  <p>{formatDate(access.lastAccessedAt)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border border-border/70 bg-card/80 py-0">
            <CardHeader className="border-b border-border/70 py-5">
              <CardTitle>Platform mix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 text-sm text-muted-foreground">
              <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/40 px-4 py-3">
                <span className="inline-flex items-center gap-2">
                  <CameraIcon className="size-4 text-foreground" />
                  Photographers
                </span>
                <strong className="text-foreground">{data.stats.photographers}</strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/40 px-4 py-3">
                <span className="inline-flex items-center gap-2">
                  <UserRoundIcon className="size-4 text-foreground" />
                  Clients
                </span>
                <strong className="text-foreground">{data.stats.clientsCount}</strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/40 px-4 py-3">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheckIcon className="size-4 text-foreground" />
                  Admin roles
                </span>
                <strong className="text-foreground">{data.stats.admins}</strong>
              </div>
              <Link
                href="/dashboard/bookings"
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/40 px-4 py-3 text-sm transition hover:border-foreground/20"
              >
                <span className="inline-flex items-center gap-2">
                  <CalendarDaysIcon className="size-4 text-foreground" />
                  Booking queue
                </span>
                <strong className="text-foreground">Open</strong>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/80 py-0">
            <CardHeader className="border-b border-border/70 py-5">
              <CardTitle>Control center intent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 text-sm text-muted-foreground">
              <p>Users represent photographers, clients, admins, and anonymous guest sessions.</p>
              <p>Albums are the core product object: photographers deliver with them, clients review through them, and admins monitor overall usage through them.</p>
              <p>Access logs and favorites show how far each gallery moved from delivery into real client engagement.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </DashboardShell>
  );
}
