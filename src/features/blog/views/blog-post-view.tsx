// features/blog/views/blog-post-view.tsx
import NextImage from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BlogPostFull } from "@/types/router-types";

export function BlogPostView({ post }: { post: BlogPostFull }) {
  return (
    <article className="min-h-screen bg-[#0e0e0e]">
      {/* Hero */}
      <div className="relative h-[55vh] overflow-hidden">
        {post.coverImage ? (
          <NextImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-white/3" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#0e0e0e] via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 -mt-20 relative z-10 pb-24">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft className="w-3 h-3" /> All posts
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          {post.category && (
            <span className="rounded-full bg-accent-red/10 border border-accent-red/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent-red">
              {post.category.name}
            </span>
          )}
          {post.publishedAt && (
            <span className="text-xs text-white/30">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          {post.readingTime && (
            <span className="text-xs text-white/30">
              {post.readingTime} min read
            </span>
          )}
        </div>

        <h1
          className="font-black text-white leading-tight mb-6"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
        >
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-white/50 text-base leading-relaxed mb-8 border-l-2 border-white/10 pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Author */}
        {post.author && (
          <div className="flex items-center gap-3 mb-10 pb-10 border-b border-white/8">
            {post.author.image && (
              <div className="relative w-9 h-9 rounded-full overflow-hidden">
                <NextImage
                  src={post.author.image}
                  alt={post.author.name ?? ""}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <p className="text-sm font-medium text-white/60">
              {post.author.name}
            </p>
          </div>
        )}

        {/* Body */}
        <div
          className="prose prose-invert max-w-none text-white/70 prose-headings:text-white prose-a:text-accent-red prose-img:rounded-xl prose-blockquote:border-white/20 prose-blockquote:text-white/40"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.postTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-white/8">
            {post.postTags.map(({ tag }) => (
              <span
                key={tag.id}
                className="rounded-full bg-white/5 border border-white/8 px-3 py-1 text-xs text-white/35"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
