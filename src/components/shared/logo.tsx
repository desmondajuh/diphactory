import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("relative h-auto flex item-center gap-2", className)}>
      <LogoIcon />
      <LogoText />
    </div>
  );
};

export const LogoIcon = ({ className }: LogoProps) => {
  return (
    <div className="relative w-24 h-24">
      <Image
        src="/logos/logo.png"
        alt="dip logo icon"
        // width={24}
        // height={24}
        fill
        className={cn("object-contain", className)}
      />
    </div>
  );
};

export const LogoText = ({ className }: LogoProps) => {
  return (
    <div className={cn("relative w-full flex items-center", className)}>
      <Image
        src="/logos/logo-text.png"
        alt="dip logo text"
        width={150}
        height={24}
        className=""
      />
    </div>
  );
};
