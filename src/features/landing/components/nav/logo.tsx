import Link from "next/link";
import { cn } from "@/lib/utils";
import LogoIcon from "@/components/icons/logo-icon";
import LogoText from "@/components/icons/logo-text";

interface LogoProps {
  className?: string;
  logoUrl?: string;
}

export function Logo({ className = "", logoUrl }: LogoProps) {
  return (
    <Link
      href={logoUrl || "/"}
      className={cn(
        "relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-accent-brand",
        className,
      )}
    >
      <LogoIcon
        // color="#b9862b"
        size={35}
      />
      <LogoText
        // color="#b9862b"
        size={90}
      />
    </Link>
  );
}
