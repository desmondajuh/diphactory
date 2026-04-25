import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardShell({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: DashboardShellProps) {
  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01)),radial-gradient(circle_at_top_left,rgba(230,48,37,0.12),transparent_35%)] p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              {eyebrow}
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                {description}
              </p>
            </div>
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </section>
      {children}
    </div>
  );
}
