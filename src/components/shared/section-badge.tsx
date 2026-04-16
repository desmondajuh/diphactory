interface SectionBadgeProps {
  icon?: React.ReactNode;
  label: string;
  className?: string;
}

export function SectionBadge({
  icon,
  label,
  className = "",
}: SectionBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${className}`}
      style={{
        background: "rgba(230, 48, 37, 0.10)",
        color: "var(--color-accent-red)",
        border: "1px solid rgba(230, 48, 37, 0.15)",
      }}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {label}
    </div>
  );
}
