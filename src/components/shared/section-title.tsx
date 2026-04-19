import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  className?: string;
  variant?: "block" | "sans";
}

export const SectionTitle = ({
  title,
  className,
  variant = "block",
}: SectionTitleProps) => {
  const isBlock = variant === "block";

  return (
    <h1
      className={cn(
        "mb-4",
        isBlock
          ? "font-display font-light leading-[0.92] tracking-[-0.03em]"
          : "text-6xl font-bold tracking-tight ",
        className,
      )}
      style={{
        fontSize: isBlock
          ? "clamp(3rem, 7.5vw, 7rem)"
          : "clamp(2.8rem, 7vw, 6.5rem)",
      }}
    >
      {title}
    </h1>
  );
};

export const SectionTitle2 = ({ title, className }: SectionTitleProps) => {
  return (
    <h2
      className={cn(
        "text-white mb-6 font-light leading-[0.92] tracking-[-0.03em]",
        className,
      )}
      style={{
        fontSize: "clamp(3rem, 7.5vw, 7rem)",
        fontFamily: "var(--font-display)",
      }}
    >
      {title}
    </h2>
  );
};
