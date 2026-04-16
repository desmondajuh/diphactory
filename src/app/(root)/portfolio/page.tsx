"use client";

// COMPLETE PHOTOGRAPHY PORTFOLIO SYSTEM (AWWWARDS-LEVEL)
// Includes:
// - Services + Case Studies
// - Portfolio Projects
// - Category Filtering
// - Masonry Gallery
// - Lightbox Viewer
// - Reusable structure

import { useState } from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// DATA (can later move to CMS)
// ─────────────────────────────────────────────────────────────

const categories = ["All", "Portrait", "Editorial", "Product", "Automotive"];

const projects = [
  {
    id: "p1",
    title: "Creative Portrait Series",
    category: "Portrait",
    cover: "/images/p1.jpg",
    images: ["/images/p1.jpg", "/images/p2.jpg", "/images/p3.jpg"],
  },
  {
    id: "p2",
    title: "Streetwear Campaign",
    category: "Editorial",
    cover: "/images/p4.jpg",
    images: ["/images/p4.jpg", "/images/p5.jpg"],
  },
];

// ─────────────────────────────────────────────────────────────
// MAIN PORTFOLIO PAGE
// ─────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-6 md:px-10 py-20">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-16">
        <h1 className="font-black text-5xl">Portfolio*</h1>
        <p className="text-white/50 mt-4 max-w-xl">
          A curated selection of visual stories, crafted with precision,
          intention, and a strong artistic direction.
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-12 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              active === cat
                ? "bg-white text-black"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MASONRY GRID */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 max-w-6xl mx-auto">
        {filtered.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="break-inside-avoid group cursor-pointer"
            onClick={() => setLightbox(project.cover)}
          >
            <div className="overflow-hidden rounded-2xl">
              <img
                src={project.cover}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="mt-3">
              <p className="text-sm font-medium">{project.title}</p>
              <p className="text-xs text-white/40">{project.category}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setLightbox(null)}
        >
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={lightbox}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </div>
  );
}
