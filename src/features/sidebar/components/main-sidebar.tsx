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
  FolderKanbanIcon,
  Grid2x2Icon,
  HomeIcon,
  ImagesIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MainUserMenu } from "./main-user-menu";

const item = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Portfolio",
    url: "/gallery",
    icon: ImagesIcon,
  },
];

export const MainSidebar = () => {
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
        ]
      : [
          {
            title: "My Collections",
            url: "/dashboard/albums",
            icon: Grid2x2Icon,
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
                <Link href="/">
                  <Image
                    src="/logos/logo.png"
                    alt="Logo"
                    width={24}
                    height={24}
                  />
                  <span>DIP + oRPC</span>
                </Link>
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
                  <SidebarMenuButton asChild className="py-5">
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
              {session.user.role === "photographer" ? "Studio" : "Workspace"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {dashboardItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="py-5">
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
