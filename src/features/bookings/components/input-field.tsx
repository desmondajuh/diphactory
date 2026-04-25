import { cn } from "@/lib/utils";

export function InputField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  hint,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-white/40"
      >
        {label}
        {required && <span className="text-accent-red">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={cn(
          "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20",
          "outline-none transition-all duration-200",
          "focus:border-white/30 focus:bg-white/8 focus:ring-1 focus:ring-white/10",
          "hover:border-white/18",
        )}
      />
      {hint && <p className="text-[11px] text-white/25">{hint}</p>}
    </div>
  );
}
