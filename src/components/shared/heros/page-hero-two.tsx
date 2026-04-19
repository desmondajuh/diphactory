import { cn } from "@/lib/utils";
import { SectionBadge } from "../section-badge";

interface PageHeroProps {
  label?: string;
  title?: {
    first: string;
    second?: string;
  };
  subTitle?: string;
  className?: string;
  badge?: string;
}

export const PageHeroTwo = ({
  label = "Page",
  title = {
    first: "LET'S CREATE",
    second: "SOMETHING.",
  },
  subTitle,
  badge,
  className,
}: PageHeroProps) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border px-6 py-16 md:px-12",
        className,
      )}
    >
      <span
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        font-display text-[clamp(80px,18vw,160px)]
        leading-none text-border/30 select-none whitespace-nowrap"
        aria-hidden
      >
        {label}
      </span>

      <div className="relative">
        {badge && (
          <SectionBadge
            label={badge}
            className="mb-3"
            icon={
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            }
          />
        )}

        <h1 className="font-display text-[clamp(44px,10vw,88px)] leading-[0.95] tracking-tight">
          <span className="block">{title.first}</span>
          {title.second && (
            <span className="block text-accent-red">{title.second}</span>
          )}
        </h1>

        {subTitle && (
          <p className="mt-4 max-w-sm text-[15px] font-light leading-relaxed text-muted-foreground">
            {subTitle}
          </p>
        )}
      </div>
    </section>
  );
};
