// features/blog/views/blog-list-view.tsx
"use client";

import { useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BlogPostWithRelations,
  BlogCategory,
  BlogTag,
} from "@/types/router-types";

interface Props {
  posts: BlogPostWithRelations[];
  categories: BlogCategory[];
  tags: BlogTag[];
}

export function BlogListView({ posts, categories, tags }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.category?.slug === activeCategory);

  return (
    <section className="min-h-screen bg-[#0e0e0e] px-6 py-24">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <p className="text-accent-red text-xs uppercase tracking-[0.22em] font-semibold mb-3">
          Blog
        </p>
        <h1
          className="font-black text-white leading-none"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        >
          Latest Insights<span className="text-accent-red">*</span>
        </h1>
        <p className="text-white/40 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
          Photography tips, industry insights, and behind-the-scenes stories.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-all",
            activeCategory === "all"
              ? "bg-white text-[#0e0e0e]"
              : "border border-white/10 text-white/40 hover:border-white/25 hover:text-white",
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-all",
              activeCategory === cat.slug
                ? "bg-white text-[#0e0e0e]"
                : "border border-white/10 text-white/40 hover:border-white/25 hover:text-white",
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filtered.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export function BlogCard({ post }: { post: BlogPostWithRelations }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-white/8 bg-white/3 overflow-hidden hover:border-white/15 transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative aspect-16/10 overflow-hidden bg-white/5">
        {post.coverImage ? (
          <NextImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
        )}
        {post.category && (
          <span className="absolute top-3 right-3 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/70">
            {post.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="flex items-center gap-3 text-[11px] text-white/25">
          {post.publishedAt && (
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          {post.readingTime && <span>{post.readingTime} min read</span>}
        </div>
        <h2 className="text-sm font-bold text-white leading-snug group-hover:text-white/80 transition-colors line-clamp-2">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-xs text-white/40 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}
        {post.postTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.postTags.slice(0, 3).map(({ tag }) => (
              <span
                key={tag.id}
                className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-white/30"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
