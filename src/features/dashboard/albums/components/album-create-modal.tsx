"use client";

import { useAtom } from "jotai";
import { albumCreateModalOpenAtom } from "@/store/albums";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateAlbumForm } from "./create-album-form";

interface AlbumCreateModalProps {
  onCreated?: () => void;
}

export const AlbumCreateModal = ({ onCreated }: AlbumCreateModalProps) => {
  const [open, setOpen] = useAtom(albumCreateModalOpenAtom);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl bg-popover/95">
        <DialogHeader>
          <DialogTitle>Create a gallery album</DialogTitle>
          <DialogDescription>
            Build a client-ready gallery link with either private access or
            lead capture for public viewing.
          </DialogDescription>
        </DialogHeader>
        <CreateAlbumForm
          onCreated={() => {
            setOpen(false);
            onCreated?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
