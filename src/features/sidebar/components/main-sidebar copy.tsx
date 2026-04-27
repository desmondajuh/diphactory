"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useSafeLogout } from "@/hooks/use-safe-logout";
import { authClient } from "@/lib/auth-client";
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
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MainUserMenu } from "./main-user-menu";
import { Logo } from "@/features/landing/components/nav/logo";
import { isAdmin } from "@/lib/permissions";

// general items for everyone
const item = [
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
];

// admin & super admin only items for pages management. should be collapsible
const adminSiteManagementItem = [
  {
    title: "Bookings",
    url: "/dashboard/bookings",
    icon: NotebookTabsIcon,
  },
  {
    title: "Testimonials",
    url: "/dashboard/admin/bookings",
    icon: MessageSquareText,
  },
  {
    title: "Gallery",
    url: "/dashboard/admin/gallery",
    icon: ImagesIcon,
  },
];

// photographer, admin & superadmin items. should be collapsible
const dashboardItem = [
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
];

export const MainSidebar = () => {
  const pathname = usePathname();
  const { data: session, isPending: userIsPending } = authClient.useSession();
  const { logout, isLoading: logoutIsLoading } = useSafeLogout();
  const dashboardItems =
    session?.user.role === "photographer"
      ? [
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
        ]
      : session?.user.role === "super_admin" || session?.user.role === "admin"
        ? [
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
              url: "/dashboard/admin/bookings",
              icon: MessageSquareText,
            },
            {
              title: "Gallery",
              url: "/dashboard/admin/gallery",
              icon: ImagesIcon,
            },
          ]
        : [
            {
              title: "Dashboard Home",
              url: "/dashboard",
              icon: ChartNoAxesCombinedIcon,
            },
          ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="py-5">
                <Logo />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {item.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="py-5"
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {session && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {session.user.role === "photographer"
                ? "Studio"
                : session.user.role === "super_admin"
                  ? "Super Admin"
                  : "Admin"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {dashboardItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="py-5"
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <MainUserMenu
              user={session?.user ?? null}
              isPending={userIsPending}
              onLogout={logout}
              isLoggingOut={logoutIsLoading}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
