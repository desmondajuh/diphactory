import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatCardProps {
  label: string;
  value: number;
  helper: string;
  icon: LucideIcon;
}

export function DashboardStatCard({
  label,
  value,
  helper,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <Card className="border border-border/70 bg-card/70 py-0 backdrop-blur-sm">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {label}
          </p>
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
          <p className="text-sm text-muted-foreground">{helper}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/70 p-3 text-muted-foreground">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
