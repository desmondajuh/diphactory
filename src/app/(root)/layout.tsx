import { Footer } from "@/features/landing/components/footer";
import { NavbarClient } from "@/features/landing/components/nav/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { client } from "@/lib/orpc";

export default async function RootGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const config = await client.siteConfig.get();
  // console.log(config);

  return (
    <main className="relative">
      <NavbarClient
        isLoggedIn={!!session}
        role={session?.user?.role ?? undefined}
      />
      {children}
      <Footer config={config} />
    </main>
  );
}
