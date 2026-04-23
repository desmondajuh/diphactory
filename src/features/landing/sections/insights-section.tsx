"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useIsMobile } from "@/hooks/use-mobile";

interface Post {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
}

const posts: Post[] = [
  {
    id: 1,
    title: "Polestar New EV",
    date: "Mar 12, 2025",
    category: "Launch Event",
    image: "/images/gallery/1.jpg",
  },
  {
    id: 2,
    title: "Audemars Piguet",
    date: "Apr 1, 2024",
    category: "Classic",
    image: "/images/gallery/2.jpg",
  },
  {
    id: 3,
    title: "Global Nikon Meetup",
    date: "Sep 14, 2024",
    category: "Photography",
    image: "/images/gallery/3.jpg",
  },
  {
    id: 4,
    title: "Design Systems 2025",
    date: "Jan 8, 2025",
    category: "Design",
    image: "/images/gallery/4.jpg",
  },
  {
    id: 5,
    title: "Creative Direction",
    date: "Feb 20, 2025",
    category: "Editorial",
    image: "/images/gallery/5.jpg",
  },
  {
    id: 6,
    title: "Urban Architecture",
    date: "Mar 3, 2025",
    category: "Culture",
    image: "/images/gallery/6.jpg",
  },
];

// const VISIBLE = 3; // cards visible at once
// const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
// const VISIBLE = isDesktop ? 3 : posts.length;

export default function LatestInsights() {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);

  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  const VISIBLE = isDesktop ? 3 : posts.length;

  const maxIndex = posts.length - VISIBLE;

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

  const visible = posts.slice(index, index + VISIBLE);

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
          Latest Blogs
        </span>

        {/* Title */}
        <h2
          className="text-[clamp(48px,7vw,80px)] font-black text-gray-900 leading-none tracking-tight mb-5"
          style={{ fontFamily: "'Arial Black', Arial, sans-serif" }}
        >
          Latest Insights.
        </h2>

        {/* Subtitle */}
        <p className="max-w-md text-sm text-gray-400 leading-relaxed">
          Explore my blog for design tips, industry insights, and creative
          inspiration. From tutorials to thought pieces, there&apos;s something
          for every curious mind.
        </p>

        {/* CTA + nav row */}
        <div className="mt-8 flex items-center gap-4">
          {/* View articles button */}
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
            View articles
          </button>

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
                src={post.image}
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
                  {post.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{post.date}</p>
              </div>
              <span className="text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-full font-medium shrink-0">
                {post.category}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
