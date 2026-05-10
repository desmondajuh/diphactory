import { cn } from "@/lib/utils";
import { GridBg } from "./effects/grid-bg";
import { NoiseBg } from "./effects/noise-bg";
import { GlowOrb } from "./effects/glow-orb";

interface SectionBgProps {
  className: string;
}

export const SectionBg = ({ className }: SectionBgProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {/* <GlowOrb /> */}
      <GlowOrb className="-left-30 -top-30 h-125 w-125" />
      {/* Bottom-right orb */}
      <GlowOrb className="-bottom-24 -right-20 h-105 w-105 animation-duration-[8s] [animation-delay:1s]" />

      <NoiseBg />
      <GridBg />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </div>
  );
};
