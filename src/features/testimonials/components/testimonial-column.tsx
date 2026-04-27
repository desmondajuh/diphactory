"use client";

import { motion } from "motion/react";
import { TestimonialCard } from "./testimonial-card";
import { Testimonial } from "@/datas/testimonials";

interface TestimonialColumnProps {
  items: Testimonial[];
  direction?: "up" | "down";
  speed?: number;
}

export function TestimonialColumn({
  items,
  direction = "up",
  speed = 40,
}: TestimonialColumnProps) {
  const duplicated = [...items, ...items]; // seamless loop

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent z-10" />
      <motion.div
        initial={{ y: direction === "up" ? 0 : "-50%" }}
        animate={{
          y: direction === "up" ? "-50%" : 0,
          x: direction === "up" ? [0, 10, 0] : [0, -10, 0],
        }}
        whileHover={{ animationPlayState: "paused" }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-col gap-6"
      >
        {duplicated.map((item, i) => (
          <TestimonialCard key={i} {...item} />
        ))}
      </motion.div>
    </div>
  );
}
