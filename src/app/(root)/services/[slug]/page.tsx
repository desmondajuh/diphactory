"use client";

// AWWWARDS-LEVEL SERVICE DETAIL PAGE
// Includes:
// - Parallax hero
// - Scroll reveal storytelling
// - Image sections
// - Cinematic layout

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { notFound } from "next/navigation";
import { services } from "@/lib/data/services";

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  if (!service) return notFound();

  return (
    <div className="bg-[#0e0e0e] text-white">
      {/* PARALLAX HERO */}
      <section ref={ref} className="relative h-[80vh] overflow-hidden">
        <motion.img
          src={service.cover}
          alt={service.title}
          style={{ y }}
          className="absolute inset-0 w-full h-full object-cover scale-110"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-10 pb-16 max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-black leading-none"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontFamily: "var(--font-display)" }}
          >
            {service.title}
            <span className="text-[var(--color-accent-red)]">*</span>
          </motion.h1>

          <p className="mt-4 text-white/70 max-w-xl text-lg">
            {service.tagline}
          </p>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="px-6 md:px-10 py-24 max-w-4xl mx-auto space-y-20">
        <RevealBlock title="Overview" text={service.caseStudy.overview} />
        <RevealBlock title="Challenge" text={service.caseStudy.challenge} />
        <RevealBlock title="Solution" text={service.caseStudy.solution} />
        <RevealBlock title="Result" text={service.caseStudy.result} />
      </section>

      {/* IMAGE BREAK */}
      <section className="h-[70vh] relative overflow-hidden">
        <motion.img
          initial={{ scale: 1.2 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.2 }}
          src={service.cover}
          className="w-full h-full object-cover"
        />
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 py-32 text-center max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-black"
          style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontFamily: "var(--font-display)" }}
        >
          Let’s Create Something
          <br />
          Extraordinary
          <span className="text-[var(--color-accent-red)]">*</span>
        </motion.h2>

        <p className="mt-4 text-white/50">
          Your story deserves more than just images — it deserves intention,
          precision, and impact.
        </p>

        <a
          href={`/booking?session=${service.slug}`}
          className="inline-block mt-8 px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-white/90 transition"
        >
          Book This Service
        </a>
      </section>
    </div>
  );
}

// REVEAL BLOCK
function RevealBlock({ title, text }: { title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="space-y-4"
    >
      <h3 className="text-xs uppercase tracking-[0.25em] text-white/40">
        {title}
      </h3>
      <p className="text-white/70 text-lg leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}
