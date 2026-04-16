import { cn } from "@/lib/utils";
import Image from "next/image";

export function Ruler() {
  const ticks = Array.from({ length: 9 }, (_, i) => i + 3);
  return (
    <div className="mt-10 border-t border-white/8 pt-3 w-full">
      <div className="flex w-full px-7">
        {ticks.map((n) => (
          <div key={n} className="flex flex-1 flex-col items-center">
            <span className="mb-1 text-[9px] font-semibold tracking-wide text-white/20">
              {String(n).padStart(2, "0")}
            </span>
            <div className="h-3 w-px bg-white/20" />
            <div className="mt-0.5 flex w-full justify-around px-0.5">
              {Array.from({ length: 29 }).map((_, j) => (
                <div key={j} className="h-1.5 w-px bg-white/10" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LensRulerProps {
  className?: string;
  borderPosition?: "top" | "bottom" | "none";
}

export function LensRuler({
  className,
  borderPosition = "top",
}: LensRulerProps) {
  const ticks = Array.from({ length: 9 }, (_, i) => i + 3);
  return (
    <div
      className={cn(
        "relative mt-10 w-full",
        borderPosition === "top" && "border-t border-white/8  pt-3",
        borderPosition === "bottom" && "border-b border-white/8  pb-3",
        borderPosition === "none" && "border-none",

        className,
      )}
    >
      {/* Desktop Ruler */}
      <Image
        src="/images/lens-ruler.svg"
        alt="ruler"
        width={1970}
        height={50}
        sizes="calc(100vw + 720px)"
        className="hidden md:block w-full object-cover object-center"
      />

      {/* Mobile Ruler */}
      <div className="flex md:hidden w-full px-7">
        {ticks.map((n) => (
          <div key={n} className="flex flex-1 flex-col items-center">
            <span className="mb-1 text-[9px] font-semibold tracking-wide text-white/20">
              {String(n).padStart(2, "0")}
            </span>
            <div className="h-2.5 w-px bg-white/20" />
            <div className="mt-px flex w-full justify-around px-0.5">
              {Array.from({ length: 9 }).map((_, j) => (
                <div key={j} className="h-1.5 w-px bg-white/10" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
