import { CameraIcon } from "@/components/icons/camera-icon";
import BlockRevealAnime from "@/components/shared/reveal-anime";
import TextRevealAnime from "@/components/shared/reveal-text-anime";
import { SectionBadge } from "@/components/shared/section-badge";
import { SectionSubTitle } from "@/components/shared/section-sub-title";
import { SectionTitle } from "@/components/shared/section-title";
import { ArrowRight } from "lucide-react";

export const CarouselTitle = () => {
  return (
    <div className="max-w-5xl mx-auto text-center relative z-10">
      {/* Badge */}
      <SectionBadge icon={<CameraIcon />} label="Photography" />

      <BlockRevealAnime>
        {/* <h1
          className="text-6xl font-bold tracking-tight mb-4"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
          }}
        >
          Every Pixel Clicked.
        </h1> */}
        <SectionTitle title="Every Pixel Clicked." />
      </BlockRevealAnime>

      <TextRevealAnime delay={1}>
        {/* <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Capturing moments, creating memories. Through my lens, I capture
          stunning visuals that bring your brand to life with clarity, emotion,
          and impact.
        </p> */}
        <SectionSubTitle
          subTitle="Capturing moments, creating memories. Through my lens, I capture
          stunning visuals that bring your brand to life with clarity, emotion,
          and impact."
        />
      </TextRevealAnime>

      <button className="bg-white shadow-md px-3 py-3 rounded-full flex items-center gap-3 mx-auto hover:shadow-lg transition">
        <span className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
          <ArrowRight size={16} />
        </span>
        Book an appointment
      </button>
    </div>
  );
};
