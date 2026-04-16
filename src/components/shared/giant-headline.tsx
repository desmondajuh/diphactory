import { cn } from "@/lib/utils";
interface GiantHeadlineProps {
  children: React.ReactNode;
  className?: string;
}

export const GiantHeadline = ({ children, className }: GiantHeadlineProps) => {
  return (
    <h1
      className={cn(
        "font-black uppercase leading-[0.88] tracking-tight text-white select-none",
        className,
      )}
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(4rem, 14vw, 13rem)",
        lineHeight: 0.88,
      }}
    >
      {children}
    </h1>
  );
};
