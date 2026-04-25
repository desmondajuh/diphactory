"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  FolderPlusIcon,
  MailIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  UserRoundIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/lib/orpc";
import { DashboardShell } from "../../components/dashboard-shell";
import { DashboardStatCard } from "../../components/dashboard-stat-card";
import { CreateAlbumForm } from "@/features/dashboard/albums/components/create-album-form";

type ClientItem = Awaited<ReturnType<typeof client.clients.list>>[number];
type ClientFormState = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

const emptyForm: ClientFormState = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

export function DashboardClientsView() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    totalClients: 0,
    totalAlbumsLinked: 0,
  });
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [albumClient, setAlbumClient] = useState<ClientItem | null>(null);
  const [form, setForm] = useState<ClientFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    try {
      const [clientRows, clientStats] = await Promise.all([
        client.clients.list(),
        client.clients.stats(),
      ]);
      setClients(clientRows);
      setStats(clientStats);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load clients.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return clients;
    }

    return clients.filter((clientRecord) =>
      [clientRecord.name, clientRecord.email, clientRecord.phone, clientRecord.notes]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query)),
    );
  }, [clients, search]);

  function openCreateClient() {
    setEditingClient(null);
    setForm(emptyForm);
    setIsClientModalOpen(true);
  }

  function openEditClient(clientRecord: ClientItem) {
    setEditingClient(clientRecord);
    setForm({
      name: clientRecord.name ?? "",
      email: clientRecord.email,
      phone: clientRecord.phone ?? "",
      notes: clientRecord.notes ?? "",
    });
    setIsClientModalOpen(true);
  }

  async function saveClient() {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    setIsSaving(true);

    try {
      if (editingClient) {
        await client.clients.update({
          clientId: editingClient.id,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          notes: form.notes.trim() || undefined,
        });
        toast.success("Client updated.");
      } else {
        await client.clients.create({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          notes: form.notes.trim() || undefined,
        });
        toast.success("Client created.");
      }

      setIsClientModalOpen(false);
      setEditingClient(null);
      setForm(emptyForm);
      await loadData();
    } catch (saveError) {
      toast.error(
        saveError instanceof Error ? saveError.message : "Could not save client.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Dialog open={isClientModalOpen} onOpenChange={setIsClientModalOpen}>
        <DialogContent className="max-w-xl bg-popover/95">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? "Edit client" : "Add a new client"}
            </DialogTitle>
            <DialogDescription>
              Keep client records close to the galleries you deliver.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Client name"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
            />
            <Input
              placeholder="Client email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
            />
            <Input
              placeholder="Phone number"
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({ ...current, phone: event.target.value }))
              }
            />
            <Textarea
              placeholder="Notes about the client or shoot"
              className="min-h-28"
              value={form.notes}
              onChange={(event) =>
                setForm((current) => ({ ...current, notes: event.target.value }))
              }
            />
            <Button onClick={() => void saveClient()} disabled={isSaving}>
              {isSaving ? "Saving..." : editingClient ? "Update client" : "Create client"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAlbumModalOpen} onOpenChange={setIsAlbumModalOpen}>
        <DialogContent className="max-w-xl bg-popover/95">
          <DialogHeader>
            <DialogTitle>Create album for client</DialogTitle>
            <DialogDescription>
              {albumClient
                ? `Create a gallery directly for ${albumClient.name ?? albumClient.email}.`
                : "Create a client gallery."}
            </DialogDescription>
          </DialogHeader>
          {albumClient ? (
            <CreateAlbumForm
              initialClientId={albumClient.id}
              initialTitle={albumClient.name ? `${albumClient.name} Gallery` : ""}
              submitLabel="Create client album"
              onCreated={() => {
                setIsAlbumModalOpen(false);
                setAlbumClient(null);
                void loadData();
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <DashboardShell
        eyebrow="Client Directory"
        title="Manage the people behind your gallery delivery work."
        description="Create client records, keep contact notes in one place, and jump straight into album creation for any client."
        actions={
          <Button onClick={openCreateClient}>
            <PlusIcon className="size-4" />
            New client
          </Button>
        }
      >
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            label="Clients"
            value={stats.totalClients}
            helper="Every client record you can reuse across future album deliveries"
            icon={UserRoundIcon}
          />
          <DashboardStatCard
            label="Linked Albums"
            value={stats.totalAlbumsLinked}
            helper="Albums already connected to a specific client"
            icon={FolderPlusIcon}
          />
        </section>

        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search clients by name, email, phone, or note"
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border border-border/70 bg-card/80">
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-44" />
                </CardHeader>
                <CardContent className="space-y-3">
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
        ) : filteredClients.length === 0 ? (
          <Card className="border border-dashed border-border/70 bg-card/70">
            <CardContent className="py-10 text-sm text-muted-foreground">
              No clients yet. Add your first client so galleries can be tied to a real record.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredClients.map((clientRecord) => (
              <Card key={clientRecord.id} className="border border-border/70 bg-card/90 py-0">
                <CardHeader className="border-b border-border/70 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle>{clientRecord.name ?? "Unnamed client"}</CardTitle>
                      <CardDescription>{clientRecord.email}</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditClient(clientRecord)}
                    >
                      <PencilIcon className="size-4" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InfoLine
                      icon={MailIcon}
                      label="Email"
                      value={clientRecord.email}
                    />
                    <InfoLine
                      icon={PhoneIcon}
                      label="Phone"
                      value={clientRecord.phone || "Not added"}
                    />
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Notes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {clientRecord.notes || "No notes saved yet."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Albums
                    </p>
                    <p className="text-sm">
                      {clientRecord.albumCount} linked album
                      {clientRecord.albumCount === 1 ? "" : "s"}
                    </p>
                    {clientRecord.latestAlbum ? (
                      <Link
                        href={`/dashboard/albums/${clientRecord.latestAlbum.id}`}
                        className="mt-2 inline-flex text-sm text-muted-foreground underline underline-offset-4"
                      >
                        Latest: {clientRecord.latestAlbum.title}
                      </Link>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">
                        No albums linked yet.
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      setAlbumClient(clientRecord);
                      setIsAlbumModalOpen(true);
                    }}
                  >
                    <FolderPlusIcon className="size-4" />
                    Create album for this client
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DashboardShell>
    </>
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
