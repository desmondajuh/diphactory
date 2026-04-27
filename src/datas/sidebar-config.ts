/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/sidebar-config.ts
import {
  ChartNoAxesCombinedIcon,
  ContactRoundIcon,
  FolderKanbanIcon,
  Globe2Icon,
  HomeIcon,
  ImagesIcon,
  InboxIcon,
  NotebookTabsIcon,
  ShieldCheckIcon,
  MessageSquareText,
} from "lucide-react";

import { UserRole } from "@/lib/permissions";

type SidebarItem = {
  title: string;
  url: string;
  icon: any;
};

type SidebarGroupConfig = {
  label: string;
  roles: UserRole[];
  items: SidebarItem[];
};

export const sidebarGroups: SidebarGroupConfig[] = [
  {
    label: "Menu",
    roles: ["client", "photographer", "admin", "super_admin"],
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: ChartNoAxesCombinedIcon,
      },
      {
        title: "Website",
        url: "/",
        icon: HomeIcon,
      },
      {
        title: "Portfolio",
        url: "/gallery",
        icon: ImagesIcon,
      },
      {
        title: "Shared Albums",
        url: "/album",
        icon: Globe2Icon,
      },
    ],
  },

  {
    label: "Studio",
    roles: ["photographer", "admin", "super_admin"],
    items: [
      {
        title: "Albums",
        url: "/dashboard/albums",
        icon: FolderKanbanIcon,
      },
      {
        title: "Clients",
        url: "/dashboard/clients",
        icon: ContactRoundIcon,
      },
      {
        title: "Leads",
        url: "/dashboard/leads",
        icon: InboxIcon,
      },
    ],
  },

  {
    label: "Admin",
    roles: ["admin", "super_admin"],
    items: [
      {
        title: "Control Center",
        url: "/dashboard/admin",
        icon: ShieldCheckIcon,
      },
      {
        title: "Bookings",
        url: "/dashboard/bookings",
        icon: NotebookTabsIcon,
      },
      {
        title: "Testimonials",
        url: "/dashboard/admin/testimonials",
        icon: MessageSquareText,
      },
      { title: "Gallery", url: "/dashboard/admin/gallery", icon: ImagesIcon },
    ],
  },
];
