"use client";

import { useRef, useState } from "react";
// import Image from "next/image";
import { gsap } from "gsap";
import { useIsMobile } from "@/hooks/use-mobile";
import { SectionWithItems } from "@/lib/db/schema";
import Link from "next/link";
import { BlogPostFeatured } from "@/types/router-types";
import { SectionBadge } from "@/components/shared/section-badge";
import { SectionBg } from "@/components/shared/section-bg";
import {
  ArrowLeft,
  ArrowRight,
  ArrowRight2,
} from "@/components/icons/arrow-icons";
import { SectionTitle } from "@/components/shared/section-title";
import { BlogPostCard } from "@/features/blog/components/blog-card";

interface InsightsSectionProps {
  sectionData: SectionWithItems | null;
  posts: BlogPostFeatured[];
}

// const VISIBLE = 3; // cards visible at once
// const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
// const VISIBLE = isDesktop ? 3 : posts.length;

export default function LatestInsights({
  sectionData,
  posts,
}: InsightsSectionProps) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);

  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  const safePosts = Array.isArray(posts) ? posts : [];
  const VISIBLE = isDesktop ? 3 : safePosts.length;
  const maxIndex = Math.max(0, safePosts.length - VISIBLE);
  const visible = safePosts.slice(index, index + VISIBLE);

  const slide = (dir: "prev" | "next") => {
    // if (!isDesktop) return;
    if (animating.current) return;
    const next =
      dir === "next" ? Math.min(index + 1, maxIndex) : Math.max(index - 1, 0);
    if (next === index) return;

    animating.current = true;
    const offset = dir === "next" ? -30 : 30;

    gsap.fromTo(
      trackRef.current,
      { x: offset, opacity: 0.6 },
      {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          animating.current = false;
        },
      },
    );
    setIndex(next);
  };

  return (
    <section className="w-full px-8 py-20 overflow-hidden relative">
      {/* Background effects */}
      <SectionBg className="" />

      {/* Header */}
      <div className="relative flex flex-col items-center text-center mb-14">
        {/* Pill badge */}
        {/* Badge */}
        <SectionBadge
          icon={
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect
                x="1"
                y="3"
                width="11"
                height="8"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M4 3V2M9 3V2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          }
          label={sectionData?.badge || "Latest Updates"}
          className="w-fit mb-2"
        />

        {/* Title */}
        <SectionTitle
          title={sectionData?.title || "Latest Insights."}
          className="text-white"
        />

        {/* Subtitle */}
        <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
          {sectionData?.subtitle ||
            "Explore my blog for design tips, industry insights, and creative inspiration. From tutorials to thought pieces, there&apos;s something for every curious mind."}
        </p>

        {/* CTA + nav row */}
        <div className="mt-8 flex items-center gap-4">
          {/* View articles button */}
          <Link href={sectionData?.ctaLink || "/blog"}>
            <button className="flex items-center gap-2 pl-1.5 pr-5 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <span className="w-8 h-8 rounded-full bg-accent-brand flex items-center justify-center shrink-0 text-white">
                <ArrowRight2 />
              </span>
              {sectionData?.ctaText || "View articles"}
            </button>
          </Link>

          {/* Nav buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => slide("prev")}
              disabled={index === 0}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-accent-brand-950 hover:text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft />
            </button>
            <button
              onClick={() => slide("next")}
              disabled={index === maxIndex}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-accent-brand-950 hover:text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div
        ref={trackRef}
        className="relative max-w-7xl mx-auto flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3 z-30
  "
      >
        {visible.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
