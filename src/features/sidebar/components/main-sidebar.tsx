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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MainUserMenu } from "./main-user-menu";
import { Logo } from "@/features/landing/components/nav/logo";
import { UserRole } from "@/lib/permissions";
import { sidebarGroups } from "@/datas/sidebar-config";

export const MainSidebar = () => {
  const pathname = usePathname();
  const { data: session, isPending: userIsPending } = authClient.useSession();
  const { logout, isLoading: logoutIsLoading } = useSafeLogout();

  const role = session?.user.role as UserRole | undefined;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        {/* Logo */}
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

        {/* Dynamic Groups */}
        {sidebarGroups
          .filter((group) => role && group.roles.includes(role))
          .map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
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
          ))}
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
