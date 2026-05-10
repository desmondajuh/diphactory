import { cn } from "@/lib/utils";

interface GlowOrbProps {
  className?: string;
}

export const GlowOrb = ({ className }: GlowOrbProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute h-96 w-96 animate-pulse rounded-full",
        "bg-radial from-accent-brand-500/22 from-0% to-transparent to-70%",
        // "-left-20 -top-20",
        // "bg-[radial-gradient(circle,rgba(180,120,20,0.28)_0%,transparent_70%)]",
        className,
      )}
      style={{
        background:
          "radial-gradient(circle, rgba(180,120,20,0.28) 0%, transparent 70%)",
      }}
    />
  );
};
