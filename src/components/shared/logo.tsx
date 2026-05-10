import Link from "next/link";
import { cn } from "@/lib/utils";
import LogoIcon from "@/components/icons/logo-icon";
import LogoText from "@/components/icons/logo-text";

interface LogoProps {
  className?: string;
  logoUrl?: string;
  color?: string;
  variant?: "icon" | "text" | "full";
}

export function Logo({
  className = "",
  logoUrl,
  color,
  variant = "full",
}: LogoProps) {
  return (
    <Link
      href={logoUrl || "/"}
      className={cn(
        "relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-accent-brand",
        className,
      )}
    >
      {variant !== "text" && <LogoIcon color={color} size={35} />}
      {variant !== "icon" && <LogoText color={color} size={90} />}
    </Link>
  );
}
