import Link from "next/link";
import { APP_NAME } from "@/constants";
import { Logo } from "@/components/shared/logo";
// import { Logo } from "@/features/landing/components/nav/logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="luxury-light relative flex min-h-screen flex-col items-center justify-center bg-[#020808] px-4 py-8 text-white selection:bg-teal-500/30 sm:px-6 lg:px-8">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-150 w-150 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-150 w-150 rounded-full bg-teal-500/10 blur-[120px]" />
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="relative z-10 mb-8 flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <Logo />
      </Link>

      {/* Auth card */}
      <div className="glassMain relative z-10 w-full max-w-md overflow-hidden rounded-2xl p-8 sm:p-10">
        {children}
      </div>

      {/* Footer text */}
      <p className="relative z-10 mt-8 text-center text-xs text-white/40">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </p>
    </div>
  );
}
