import { cn } from "@/lib/utils";
import { SectionBadge } from "./section-badge";

type HeroVariant = "left" | "center" | "right";

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  variant?: HeroVariant;
  className?: string;
}

const variantStyles = {
  left: {
    container: "text-left justify-start items-start",
    inner: "max-w-xl items-start",
  },
  center: {
    container: "text-center justify-center items-center mx-auto",
    inner: "max-w-2xl items-center",
  },
  right: {
    container: "text-right justify-end items-end ml-auto",
    inner: "max-w-xl items-end",
  },
};

export const SectionHeader = ({
  label,
  title,
  subtitle,
  badge,
  className,
  variant = "center",
}: SectionHeaderProps) => {
  const isCenter = variant === "center";
  return (
    <section
      className={cn(
        "relative flex overflow-hidden px-6 py-16 md:px-12",
        variantStyles[variant].container,
        className,
      )}
    >
      {label && (
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        font-display text-[clamp(80px,18vw,160px)]
        leading-none text-border/30 select-none whitespace-nowrap"
          aria-hidden
        >
          {label}
        </span>
      )}

      <div
        className={cn("relative flex flex-col", variantStyles[variant].inner)}
      >
        {badge && (
          <SectionBadge
            label={badge}
            className="mb-3 w-fit"
            icon={
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            }
          />
        )}

        <h1 className="font-display text-[clamp(44px,10vw,88px)] leading-[0.95] tracking-tight">
          {title}
          <span className="text-accent-brand">*</span>
        </h1>

        {subtitle && (
          <p
            className={cn(
              "mt-4 text-[15px] font-light leading-relaxed text-muted-foreground",
              isCenter ? "max-w-xl" : "max-w-md",
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};
