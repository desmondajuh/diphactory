"use client";

// PROJECT DETAIL PAGES (CINEMATIC / AWWWARDS STYLE)
// Route: /app/portfolio/[slug]/page.tsx
// Includes:
// - Hero
// - Story sections
// - Gallery (grid + immersive)
// - Sticky CTA

import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

// ─────────────────────────────────────────────
// MOCK DATA (move to CMS later)
// ─────────────────────────────────────────────

const projects = [
  {
    slug: "creative-portrait-series",
    title: "Creative Portrait Series",
    category: "Portrait",
    cover: "/images/p1.jpg",
    description:
      "A cinematic portrait exploration focused on light, shadow, and human expression.",
    story: {
      brief:
        "The goal was to create a striking portrait series that balances emotion with strong visual identity.",
      approach:
        "We used controlled lighting setups, deep shadows, and minimal styling to focus entirely on expression.",
      outcome:
        "The result is a bold and timeless set of portraits that feel both artistic and personal.",
    },
    images: [
      "/images/p1.jpg",
      "/images/p2.jpg",
      "/images/p3.jpg",
      "/images/p4.jpg",
    ],
  },
];

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!project) return notFound();

  return (
    <div className="bg-[#0e0e0e] text-white">
      {/* HERO */}
      <section className="relative h-[80vh] flex items-end">
        <img
          src={project.cover}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 px-6 md:px-10 pb-16 max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-black"
            style={{
              fontSize: "clamp(3rem,7vw,5rem)",
              fontFamily: "var(--font-display)",
            }}
          >
            {project.title}
            <span className="text-[var(--color-accent-red)]">*</span>
          </motion.h1>

          <p className="mt-4 text-white/70 max-w-xl">{project.description}</p>
        </div>
      </section>

      {/* STORY */}
      <section className="px-6 md:px-10 py-24 max-w-4xl mx-auto space-y-16">
        <StoryBlock title="Brief" text={project.story.brief} />
        <StoryBlock title="Approach" text={project.story.approach} />
        <StoryBlock title="Outcome" text={project.story.outcome} />
      </section>

      {/* GALLERY */}
      <section className="px-4 md:px-10 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {project.images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-2xl"
            >
              <img
                src={img}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 pb-32 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="font-black"
          style={{
            fontSize: "clamp(2rem,5vw,3rem)",
            fontFamily: "var(--font-display)",
          }}
        >
          Want something like this?
          <span className="text-[var(--color-accent-red)]">*</span>
        </motion.h2>

        <a
          href="/booking"
          className="inline-block mt-6 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-white/90 transition"
        >
          Book a Similar Shoot
        </a>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function StoryBlock({ title, text }: { title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="space-y-3"
    >
      <p className="text-xs uppercase tracking-[0.25em] text-white/40">
        {title}
      </p>
      <p className="text-lg text-white/70 leading-relaxed">{text}</p>
    </motion.div>
  );
}
