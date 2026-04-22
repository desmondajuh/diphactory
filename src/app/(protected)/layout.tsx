import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MainSidebarProvider } from "@/features/sidebar/main/main-sidebar-provider";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("sign-in");
  }

  return (
    <MainSidebarProvider>
      <main className="w-full h-full p-6 md:p-8">{children}</main>
    </MainSidebarProvider>
  );
};

export default Layout;
