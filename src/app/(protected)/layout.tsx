import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MainSidebarProvider } from "@/features/sidebar/main/main-sidebar-provider";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const showSidebar =
    session.user.role === "photographer" ||
    session.user.role === "admin" ||
    session.user.role === "super_admin";

  if (!showSidebar) {
    return (
      <div className="min-h-svh bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,rgba(12,12,12,0.98),rgba(18,18,18,0.96))] text-white">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logos/logo.png"
                alt="Diai Image Phactory"
                width={32}
                height={32}
              />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Gallery Access
                </p>
                <p className="text-sm font-medium text-white">
                  Diai Image Phactory
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" asChild className="text-white hover:bg-white/10 hover:text-white">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" asChild className="text-white hover:bg-white/10 hover:text-white">
                <Link href="/album">Albums</Link>
              </Button>
              <Button variant="ghost" asChild className="text-white hover:bg-white/10 hover:text-white">
                <Link href="/gallery">Portfolio</Link>
              </Button>
              <Button variant="ghost" asChild className="text-white hover:bg-white/10 hover:text-white">
                <Link href="/contact">Contact</Link>
              </Button>
            </nav>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
    );
  }

  const sidebarRole = session.user.role as "photographer" | "admin" | "super_admin";

  return (
    <MainSidebarProvider role={sidebarRole}>
      {children}
    </MainSidebarProvider>
  );
};

export default Layout;
