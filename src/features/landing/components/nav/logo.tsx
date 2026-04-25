import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black",
        className,
      )}
    >
      {/* <Gem className="h-5 w-5 text-emerald-400" /> */}
      <Image
        src="/logos/logo.png"
        alt="DIP"
        width={32}
        height={32}
        className="object-contain w-8 h-8"
      />
      <span
        className="font-medium text-3xl text-accent-red dark:text-white uppercase"
        style={{
          fontFamily: "var(--font-display)",
          // fontSize: "clamp(4rem, 14vw, 13rem)",
          lineHeight: 0.88,
        }}
      >
        DIP
      </span>
    </Link>
  );
}
