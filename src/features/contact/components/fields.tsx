// ── SHARED FIELD ──────────────────────────────────────────────

export const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
      {label}
    </label>
    {children}
  </div>
);
