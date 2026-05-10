import { cn } from "@/lib/utils";
import { SectionBadge } from "../section-badge";
import { splitWordBalanced } from "@/utils/text-utils";

type HeroVariant = "left" | "center" | "right";

interface PageHeroProps {
  label?: string;
  title?: string;
  subTitle?: string;
  className?: string;
  badge?: string;
  variant?: HeroVariant;
  badgeActive?: boolean;
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

export const PageHeroTwo = ({
  label = "Page",
  title = "LETS CREATE SOMETHING",
  subTitle,
  badge,
  className,
  variant = "left",
  badgeActive = false,
}: PageHeroProps) => {
  const titleObj = splitWordBalanced(title || "LETS CREATE SOMETHING");
  // console.log(titleObj);
  return (
    <section
      className={cn(
        "relative flex overflow-hidden border-b border-border px-6 py-16 md:px-12",
        variantStyles[variant].container,
        className,
      )}
    >
      <span
        className="pointer-events-none uppercase absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        font-display text-[clamp(80px,18vw,160px)]
        leading-none text-border/30 select-none whitespace-nowrap"
        aria-hidden
      >
        {label}
      </span>

      <div
        className={cn("relative flex flex-col", variantStyles[variant].inner)}
      >
        {badge && (
          <SectionBadge
            label={badge}
            className="mb-3 w-fit"
            icon={
              <span
                className={cn(
                  "h-1.5 w-1.5 animate-pulse rounded-full bg-white",
                  badgeActive && "bg-green-400",
                )}
              />
            }
          />
        )}

        <h1 className="font-display text-[clamp(44px,10vw,88px)] leading-[0.95] tracking-tight">
          <span className="block">{titleObj.first}</span>
          {titleObj.second && (
            <span className="block text-accent-brand">{titleObj.second}</span>
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
