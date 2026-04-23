import { CameraIcon } from "@/components/icons/camera-icon";
import BlockRevealAnime from "@/components/shared/reveal-anime";
import TextRevealAnime from "@/components/shared/reveal-text-anime";
import { SectionBadge } from "@/components/shared/section-badge";
import { SectionSubTitle } from "@/components/shared/section-sub-title";
import { SectionTitle } from "@/components/shared/section-title";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const CarouselTitle = () => {
  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10 px-3">
      {/* Badge */}
      <SectionBadge
        icon={<CameraIcon />}
        label="Photography"
        className="w-fit mb-2"
      />

      <BlockRevealAnime>
        <SectionTitle title="Every Pixel Clicked." className="text-black" />
      </BlockRevealAnime>

      <TextRevealAnime delay={1}>
        {/* <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Capturing moments, creating memories. Through my lens, I capture
          stunning visuals that bring your brand to life with clarity, emotion,
          and impact.
        </p> */}
        <SectionSubTitle
          className="max-w-2xl"
          subTitle="Capturing moments, creating memories. Through my lens, I capture stunning visuals that bring your brand to life with clarity, emotion,
          and impact."
        />
      </TextRevealAnime>

      <Link
        href="/bookings"
        className="shadow-md px-3 py-3 rounded-full flex items-center gap-3 mx-auto hover:shadow-lg transition text-gray-600 hover:text-accent-red cursor-pointer"
      >
        <span className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
          <ArrowRight size={16} />
        </span>
        <span className="mr-2">Book an appointment</span>
      </Link>
    </div>
  );
};
