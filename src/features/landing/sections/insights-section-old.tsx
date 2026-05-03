/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, animate } from "motion/react";

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

export default function LatestInsights() {
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [visible, setVisible] = useState(3);

  // Responsive logic
  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;

      if (width < 640) setVisible(1);
      else if (width < 1024) setVisible(2);
      else setVisible(3);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Measure card width
  useEffect(() => {
    if (!containerRef.current) return;
    const firstCard = containerRef.current.querySelector("[data-card]");
    if (!firstCard) return;

    const rect = (firstCard as HTMLElement).getBoundingClientRect();
    setCardWidth(rect.width + 20); // include gap
  }, [visible]);

  const maxIndex = posts.length - visible;

  // Animate to index
  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(i, maxIndex));
    setIndex(clamped);

    animate(x, -clamped * cardWidth, {
      type: "spring",
      stiffness: 260,
      damping: 30,
    });
  };

  // Drag end → snap
  const handleDragEnd = (_: any, info: any) => {
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    let newIndex = index;

    if (Math.abs(offset) > cardWidth / 3 || Math.abs(velocity) > 500) {
      if (offset < 0) newIndex += 1;
      else newIndex -= 1;
    }

    goTo(newIndex);
  };

  return (
    <section className="w-full px-6 md:px-8 py-20 bg-white overflow-hidden">
      {/* Header (unchanged) */}
      <div className="flex flex-col items-center text-center mb-14">
        <h2 className="text-[clamp(36px,6vw,72px)] font-black tracking-tight">
          Latest Insights.
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Track */}
        <motion.div
          ref={containerRef}
          className="flex gap-5 cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{
            left: -maxIndex * cardWidth,
            right: 0,
          }}
          dragElastic={0.08}
          onDragEnd={handleDragEnd}
        >
          {posts.map((post) => (
            <article
              key={post.id}
              data-card
              className="
                min-w-[85%] sm:min-w-[60%] md:min-w-[calc(50%-10px)] 
                lg:min-w-[calc(33.333%-13px)]
                flex flex-col group cursor-pointer
              "
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
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

                <span className="text-xs bg-gray-100 px-4 py-2 rounded-full">
                  {post.category}
                </span>
              </div>
            </article>
          ))}
        </motion.div>

        {/* Buttons (desktop only) */}
        <div className="hidden md:flex justify-end gap-2 mt-6">
          <button
            onClick={() => goTo(index - 1)}
            className="w-10 h-10 rounded-full border"
          >
            ←
          </button>
          <button
            onClick={() => goTo(index + 1)}
            className="w-10 h-10 rounded-full border"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
