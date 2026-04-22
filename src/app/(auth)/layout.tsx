import Link from "next/link";
import { Gem } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="luxury-light relative flex min-h-screen flex-col items-center justify-center bg-[#020808] px-4 py-8 text-white selection:bg-teal-500/30 sm:px-6 lg:px-8">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-teal-500/10 blur-[120px]" />
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="relative z-10 mb-8 flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 ring-1 ring-emerald-500/30">
          <Gem className="h-5 w-5 text-emerald-400" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          DanajStores
        </span>
      </Link>

      {/* Auth card */}
      <div className="glassMain relative z-10 w-full max-w-md overflow-hidden rounded-2xl p-8 sm:p-10">
        {children}
      </div>

      {/* Footer text */}
      <p className="relative z-10 mt-8 text-center text-xs text-white/40">
        &copy; {new Date().getFullYear()} DanajStores. All rights reserved.
      </p>
    </div>
  );
}
