"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useIsMobile } from "@/hooks/use-mobile";
import { SectionWithItems } from "@/lib/db/schema";
import Link from "next/link";
import { BlogPostFeatured } from "@/types/router-types";

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
    <section className="w-full px-8 py-20 overflow-hidden relative bg-white">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-105 h-105 rounded-full bg-gray-100/80" />
        <div className="absolute -bottom-10 -right-10 w-[320px] h-80 rounded-full bg-gray-100/60" />
      </div>

      {/* Header */}
      <div className="relative flex flex-col items-center text-center mb-14">
        {/* Pill badge */}
        <span className="mb-5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-red-200 bg-red-50 text-accent-red text-xs font-medium">
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
          {sectionData?.badge || "Latest Blogs"}
        </span>

        {/* Title */}
        <h2
          className="text-[clamp(48px,7vw,80px)] font-black text-gray-900 leading-none tracking-tight mb-5"
          style={{ fontFamily: "'Arial Black', Arial, sans-serif" }}
        >
          {sectionData?.title || "Latest Insights."}
        </h2>

        {/* Subtitle */}
        <p className="max-w-md text-sm text-gray-400 leading-relaxed">
          {sectionData?.subtitle ||
            "Explore my blog for design tips, industry insights, and creative inspiration. From tutorials to thought pieces, there&apos;s something for every curious mind."}
        </p>

        {/* CTA + nav row */}
        <div className="mt-8 flex items-center gap-4">
          {/* View articles button */}
          <Link href={sectionData?.ctaLink || "/blog"}>
            <button className="flex items-center gap-2 pl-1.5 pr-5 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <span className="w-8 h-8 rounded-full bg-accent-red flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7h8M7.5 3.5L11 7l-3.5 3.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {sectionData?.ctaText || "View articles"}
            </button>
          </Link>

          {/* Nav buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => slide("prev")}
              disabled={index === 0}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9 2.5L4.5 7 9 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => slide("next")}
              disabled={index === maxIndex}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M5 2.5L9.5 7 5 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div
        ref={trackRef}
        className="max-w-7xl mx-auto
    flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory
    md:grid md:grid-cols-2 md:overflow-visible
    lg:grid-cols-3
  "
      >
        {visible.map((post) => (
          <article
            key={post.id}
            className="snap-start flex flex-col cursor-pointer group min-w-[80%] sm:min-w-[60%] md:min-w-0"
          >
            {/* Image */}
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden">
              <Image
                src={post.coverImage || "/images/fallback/post_image.png"}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover  w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Meta */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-[15px] font-bold text-gray-900">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {post.updatedAt.toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-full font-medium shrink-0">
                {post.category?.name ?? "Uncategorized"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
