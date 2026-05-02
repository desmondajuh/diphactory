// features/blog/components/featured-posts.tsx
import NextImage from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogPostFeatured } from "@/types/router-types";

export function FeaturedPosts({ posts }: { posts: BlogPostFeatured[] }) {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-accent-red text-xs uppercase tracking-[0.22em] font-semibold mb-3">
              Blog
            </p>
            <h2
              className="font-black text-black leading-none"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Latest Insights<span className="text-accent-red">*</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-2 rounded-full bg-accent-red px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-red/90 transition-all"
          >
            View articles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-black/5 hover:border-black/10 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black/5">
                {post.coverImage && (
                  <NextImage
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5 space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-black/40">
                    {post.publishedAt &&
                      new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </span>
                  {post.category && (
                    <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-semibold text-black/40 uppercase tracking-wider">
                      {post.category.name}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-black leading-snug line-clamp-2 group-hover:text-black/70 transition-colors">
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/blog"
          className="sm:hidden mt-8 flex items-center justify-center gap-2 rounded-full bg-accent-red px-5 py-2.5 text-sm font-bold text-white"
        >
          View all articles <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
