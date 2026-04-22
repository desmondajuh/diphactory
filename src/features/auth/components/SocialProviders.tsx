"use client";

import Image from "next/image";

interface SocialProvidersProps {
  action: "sign-in" | "sign-up";
}

export function SocialProviders({ action }: SocialProvidersProps) {
  const label = action === "sign-in" ? "Sign in" : "Sign up";

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition-all hover:border-emerald-500/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
        aria-label={`${label} with Google`}
      >
        <Image
          src="/icons/google.svg"
          alt="Google"
          width={20}
          height={20}
          className="shrink-0"
        />
        <span>{label} with Google</span>
      </button>

      <button
        type="button"
        className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition-all hover:border-emerald-500/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
        aria-label={`${label} with Apple`}
      >
        <Image
          src="/icons/apple.svg"
          alt="Apple"
          width={20}
          height={20}
          className="shrink-0"
        />
        <span>{label} with Apple</span>
      </button>
    </div>
  );
}
