"use client";

import { useState } from "react";
import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { albumCreateModalOpenAtom } from "@/store/albums";
import { AlbumsBreadcrumbs } from "../components/albums-breadcrumbs";
import { DashboardAlbumsList } from "../components/albums-list";
import { AlbumCreateModal } from "../components/album-create-modal";

export const DashboardAlbumsView = () => {
  const setModalOpen = useSetAtom(albumCreateModalOpenAtom);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <AlbumCreateModal onCreated={() => setRefreshKey((value) => value + 1)} />
      <div className="flex w-full flex-col gap-5">
        <AlbumsBreadcrumbs />
        <section className="rounded-[1.75rem] border border-border/70 bg-linear-to-br from-card via-card to-muted/50 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Photographer Workspace
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">
                Deliver galleries that feel intentional from the first click.
              </h2>
              <p className="text-sm text-muted-foreground">
                Create private client galleries with access codes, or public
                galleries that collect leads before anyone sees the images.
              </p>
            </div>
            <Button className="w-fit" onClick={() => setModalOpen(true)}>
              <PlusIcon className="size-4" />
              New album
            </Button>
          </div>
        </section>
        <DashboardAlbumsList refreshKey={refreshKey} />
      </div>
    </>
  );
};
