import { Footer } from "@/features/landing/components/footer";
import { NavbarClient } from "@/features/landing/components/nav/navbar";

export default function RootGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative">
      <NavbarClient />
      {children}
      <Footer />
    </main>
  );
}
