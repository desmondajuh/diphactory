"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { client } from "@/lib/orpc";
import { Button } from "@/components/ui/button";
import { AlbumIdDetails } from "../components/album-id-details";
import { AlbumIdBreadCrumbs } from "../components/album-id-breadcrumbs";

interface Props {
  albumId: string;
}

export const DashboardAlbumView = ({ albumId }: Props) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [albumTitle, setAlbumTitle] = useState("Album details");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex w-full flex-col gap-5">
      <AlbumIdBreadCrumbs albumTitle={albumTitle} />
      <section className="rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-card via-card to-muted/50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Album Management
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Fine-tune the gallery before you send it out.
            </h2>
            <p className="text-sm text-muted-foreground">
              Review sharing settings, copy the live link, and confirm the album
              is ready for client selections.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setRefreshKey((value) => value + 1)}
            >
              Refresh
            </Button>
            <Button
              onClick={async () => {
                setIsDeleting(true);
                try {
                  await client.albums.delete({ albumId });
                  toast.success("Album deleted.");
                  router.push("/dashboard/albums");
                } catch (error) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "Album could not be deleted.",
                  );
                } finally {
                  setIsDeleting(false);
                }
              }}
              variant="destructive"
              className="w-fit"
              disabled={isDeleting}
            >
            <Trash2Icon className="size-4" />
              {isDeleting ? "Deleting..." : "Delete album"}
            </Button>
          </div>
        </div>
      </section>
      <AlbumIdDetails
        albumId={albumId}
        refreshKey={refreshKey}
        onLoaded={setAlbumTitle}
      />
    </div>
  );
};
