// features/admin/blog/views/blog-admin-view.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { client } from "@/lib/orpc";
import {
  BlogPostWithRelations,
  BlogCategory,
  BlogTag,
} from "@/types/router-types";
import { cn } from "@/lib/utils";

interface Props {
  initialPosts: BlogPostWithRelations[];
  categories: BlogCategory[];
  tags: BlogTag[];
}

export function BlogAdminView({ initialPosts, categories, tags }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  const refresh = async () => {
    const data = await client.blog.listAll();
    setPosts(data);
  };

  const handleDelete = async (id: string) => {
    try {
      await client.blog.remove({ id });
      toast.success("Post deleted");
      setDeletingId(null);
      await refresh();
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await client.blog.createCategory({ name: newCategory.trim() });
      toast.success("Category added");
      setNewCategory("");
    } catch {
      toast.error("Failed to add category");
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      await client.blog.createTag({ name: newTag.trim() });
      toast.success("Tag added");
      setNewTag("");
    } catch {
      toast.error("Failed to add tag");
    }
  };

  const statusColors: Record<string, string> = {
    published: "bg-green-500/10 text-green-400",
    draft: "bg-white/8 text-white/30",
    archived: "bg-yellow-500/10 text-yellow-400",
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Blog</h1>
          <p className="text-sm text-white/35 mt-1">{posts.length} posts</p>
        </div>
        <Link
          href="/dashboard/admin/blog/new"
          className="rounded-full bg-white text-[#0e0e0e] px-6 py-2.5 text-sm font-bold hover:bg-white/90 transition-all"
        >
          + New post
        </Link>
      </div>

      {/* Posts list */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl border border-white/8 bg-white/3 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      statusColors[post.status],
                    )}
                  >
                    {post.status}
                  </span>
                  {post.isFeatured && (
                    <span className="rounded-full bg-accent-red/10 border border-accent-red/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-red">
                      Featured
                    </span>
                  )}
                  {post.category && (
                    <span className="text-[10px] text-white/25">
                      {post.category.name}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-white truncate">
                  {post.title}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-white/20">
                  {post.publishedAt && (
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                  {post.readingTime && <span>{post.readingTime} min read</span>}
                  {post.postTags.length > 0 && (
                    <span>
                      {post.postTags.map(({ tag }) => `#${tag.name}`).join(" ")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/dashboard/admin/blog/${post.id}/edit`}
                  className="rounded-full border border-white/12 px-4 py-1.5 text-xs font-medium text-white/50 hover:text-white hover:border-white/25 transition-all"
                >
                  Edit
                </Link>
                {deletingId === post.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="text-xs text-white/30 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeletingId(post.id)}
                    className="rounded-full border border-red-500/20 px-4 py-1.5 text-xs font-medium text-red-400/70 hover:border-red-500/40 hover:text-red-400 transition-all"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories & Tags management */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          {
            label: "Categories",
            items: categories,
            value: newCategory,
            setValue: setNewCategory,
            onAdd: handleAddCategory,
            onDelete: (id: string) => client.blog.deleteCategory({ id }),
          },
          {
            label: "Tags",
            items: tags,
            value: newTag,
            setValue: setNewTag,
            onAdd: handleAddTag,
            onDelete: (id: string) => client.blog.deleteTag({ id }),
          },
        ].map(({ label, items, value, setValue, onAdd, onDelete }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-4"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">
              {label}
            </p>
            <div className="flex gap-2">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onAdd()}
                placeholder={`New ${label.toLowerCase().slice(0, -1)}...`}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/25 placeholder:text-white/20"
              />
              <button
                onClick={onAdd}
                className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/15 transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/8 px-3 py-1"
                >
                  <span className="text-xs text-white/50">{item.name}</span>
                  <button
                    onClick={async () => {
                      await onDelete(item.id);
                      toast.success("Deleted");
                    }}
                    className="text-white/20 hover:text-red-400 transition-colors text-xs leading-none"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
