import { Footer } from "@/features/landing/components/footer";
import { NavbarClient } from "@/features/landing/components/nav/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function RootGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // const showSidebar =
  //   session.user.role === "photographer" ||
  //   session.user.role === "admin" ||
  //   session.user.role === "super_admin";

  return (
    <main className="relative">
      <NavbarClient
        isLoggedIn={!!session}
        role={session?.user?.role ?? undefined}
      />
      {children}
      <Footer />
    </main>
  );
}
