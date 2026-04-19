import { cn } from "@/lib/utils";

interface SectionSubTitleProps {
  subTitle: string;
  className?: string;
}
export const SectionSubTitle = ({
  subTitle,
  className,
}: SectionSubTitleProps) => {
  return (
    <p className={cn("text-gray-600 max-w-2xl mx-auto mb-6", className)}>
      {subTitle}
    </p>
  );
};
