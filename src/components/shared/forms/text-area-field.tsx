import { cn } from "@/lib/utils";

export function TextareaField({
  label,
  id,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  id: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-widest text-white/40"
      >
        {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={cn(
          "resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20",
          "outline-none transition-all duration-200",
          "focus:border-white/30 focus:bg-white/8 focus:ring-1 focus:ring-white/10",
          "hover:border-white/18",
        )}
      />
    </div>
  );
}
