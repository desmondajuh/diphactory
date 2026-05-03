"use client";

import { ReactLenis } from "lenis/react";
import { PageHero } from "@/components/shared/page-hero";
import { MasonryGallery } from "../sections/masonry-gallery";
import { MasonryGallery2 } from "../sections/masonry";

export default function GalleryView() {
  return (
    <ReactLenis root>
      <div className="min-h-screen bg-[#0e0e0e] text-white relative overflow-hidden">
        {/* Grain */}
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.03] z-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Hero */}
        <PageHero title="DIP Gallery" />
        <MasonryGallery />
        {/* <MasonryGallery2 /> */}
      </div>
    </ReactLenis>
  );
}
