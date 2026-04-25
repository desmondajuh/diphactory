import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MainSidebar } from "../components/main-sidebar";

interface Props {
  children: React.ReactNode;
  role: "photographer" | "admin" | "super_admin";
}

const roleMeta = {
  photographer: {
    label: "Studio Workspace",
    description: "Manage albums, sharing, and delivery from here.",
  },
  admin: {
    label: "Admin Workspace",
    description: "Monitor platform activity and operational health.",
  },
  super_admin: {
    label: "Super Admin Control Center",
    description: "Oversee users, galleries, access, and platform movement.",
  },
} as const;

export const MainSidebarProvider = ({ children, role }: Props) => {
  const meta = roleMeta[role];

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset className="min-h-svh">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/70 bg-background/92 px-4 py-4 backdrop-blur-md md:px-8">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {meta.label}
            </p>
            <p className="text-sm text-muted-foreground">{meta.description}</p>
          </div>
          <SidebarTrigger className="shrink-0" />
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};
