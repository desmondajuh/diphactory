import { cn } from "@/lib/utils";

interface GridBgProps {
  className?: string;
}

export const GridBg = ({ className }: GridBgProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 opacity-[0.045]",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(rgba(201,146,42,0.6) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(201,146,42,0.6) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }}
    />
  );
};
