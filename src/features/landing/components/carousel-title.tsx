import { CameraIcon } from "@/components/icons/camera-icon";
import BlockRevealAnime from "@/components/shared/reveal-anime";
import TextRevealAnime from "@/components/shared/reveal-text-anime";
import { SectionBadge } from "@/components/shared/section-badge";
import { SectionSubTitle } from "@/components/shared/section-sub-title";
import { SectionTitle } from "@/components/shared/section-title";
// import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CarouselTitleProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

export const CarouselTitle = ({
  badge,
  title,
  subtitle,
  ctaText,
  ctaLink,
  className,
}: CarouselTitleProps) => {
  return (
    <div
      className={cn(
        "max-w-5xl mx-auto flex flex-col items-center text-center relative z-10 px-3",
        className,
      )}
    >
      {/* Badge */}
      <SectionBadge
        icon={<CameraIcon />}
        label={badge || "Photography"}
        className="w-fit mb-2"
      />

      <BlockRevealAnime>
        <SectionTitle
          title={title || "Every Pixel Clicked."}
          className="text-gray-950  opacity-90"
        />
      </BlockRevealAnime>

      <TextRevealAnime delay={1}>
        {/* <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Capturing moments, creating memories. Through my lens, I capture
          stunning visuals that bring your brand to life with clarity, emotion,
          and impact.
        </p> */}
        <SectionSubTitle className="max-w-2xl" subTitle={subtitle || ""} />
      </TextRevealAnime>

      <Link href={ctaLink || "/bookings"}>
        <button
          // href={ctaLink || "/bookings"}
          className="shadow-md px-3 py-3 rounded-full flex items-center gap-3 mx-auto hover:shadow-lg transition-shadow text-gray-600 hover:text-accent-brand border border-gray-200/30"
        >
          <span className="bg-accent-brand text-white w-8 h-8 flex items-center justify-center rounded-full">
            <ArrowRight size={16} />
          </span>
          <span className="mr-2">{ctaText || "Book an appointment"}</span>
        </button>
      </Link>
    </div>
  );
};
