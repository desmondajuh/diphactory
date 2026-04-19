export const Footer = () => {
  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-4 md:px-10">
      <p className="text-xs text-muted-foreground">
        © 2026 Diphactory. All rights reserved.
      </p>
      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className="text-accent-red">⚡</span>
        Typically responds within 24–48 hours
      </span>
    </div>
  );
};
