"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MailIcon, UserRoundIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/lib/orpc";
import { DashboardShell } from "../../components/dashboard-shell";

type LeadItem = Awaited<ReturnType<typeof client.leads.list>>[number];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function DashboardLeadsView() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadLeads() {
      setIsLoading(true);
      setError(null);

      try {
        const rows = await client.leads.list();
        if (active) {
          setLeads(rows);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error ? loadError.message : "Could not load leads.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadLeads();

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardShell
      eyebrow="Lead Capture"
      title="See who entered public galleries and which album caught their attention."
      description="Public album visits can become real inbound leads. This page keeps the lead and the viewed album together."
    >
      {isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border border-border/70 bg-card/80">
              <CardHeader>
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-44" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
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
      ) : leads.length === 0 ? (
        <Card className="border border-dashed border-border/70 bg-card/70">
          <CardContent className="py-10 text-sm text-muted-foreground">
            No leads yet. Public galleries will start filling this page once viewers enter their details.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {leads.map((lead) => (
            <Card key={lead.id} className="border border-border/70 bg-card/90 py-0">
              <CardHeader className="border-b border-border/70 py-5">
                <div className="space-y-1">
                  <CardTitle>{lead.name ?? "Unnamed lead"}</CardTitle>
                  <CardDescription>{lead.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoLine icon={MailIcon} label="Email" value={lead.email} />
                  <InfoLine
                    icon={UserRoundIcon}
                    label="Captured"
                    value={formatDate(lead.capturedAt)}
                  />
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Album viewed
                  </p>
                  <Link
                    href={`/dashboard/albums/${lead.album.id}`}
                    className="font-medium underline underline-offset-4"
                  >
                    {lead.album.title}
                  </Link>
                  <p className="mt-2 text-sm text-muted-foreground">
                    /album/{lead.album.slug} • {lead.album.visibility}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/50 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Icon className="size-3.5" />
        <span>{label}</span>
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
