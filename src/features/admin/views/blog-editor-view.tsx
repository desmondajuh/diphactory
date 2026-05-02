// features/admin/blog/views/blog-editor-view.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { client } from "@/lib/orpc";
import { useUploadThing } from "@/lib/uploadthing-client";
import { RichTextEditor } from "@/features/blog/components/rich-text-editor";
import {
  BlogPostWithRelations,
  BlogCategory,
  BlogTag,
} from "@/types/router-types";
import NextImage from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  post: BlogPostWithRelations | null;
  categories: BlogCategory[];
  tags: BlogTag[];
}

export function BlogEditorView({ post, categories, tags }: Props) {
  const router = useRouter();
  const isEditing = !!post;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const { startUpload } = useUploadThing("galleryUploader");

  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    coverImage: post?.coverImage ?? "",
    coverImageUtKey: post?.coverImageUtKey ?? "",
    categoryId: post?.category?.id ?? "",
    status: post?.status ?? ("draft" as "draft" | "published" | "archived"),
    isFeatured: post?.isFeatured ?? false,
  });

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    post?.postTags.map((pt) => pt.tag.id) ?? [],
  );

  const setField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleTag = (id: string) =>
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );

  const handleCoverUpload = async (file: File) => {
    setCoverUploading(true);
    try {
      const results = await startUpload([file]);
      if (results?.[0]) {
        setField("coverImage", results[0].ufsUrl);
        setField("coverImageUtKey", results[0].key);
      }
    } catch {
      toast.error("Cover upload failed");
    } finally {
      setCoverUploading(false);
    }
  };

  const handleSave = async (status?: "draft" | "published" | "archived") => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        status: status ?? form.status,
        categoryId: form.categoryId || null,
        coverImage: form.coverImage || null,
        coverImageUtKey: form.coverImageUtKey || null,
        tagIds: selectedTagIds,
      };

      if (isEditing) {
        await client.blog.update({ id: post.id, ...payload });
        toast.success("Post updated");
      } else {
        await client.blog.create(payload);
        toast.success("Post created");
        router.push("/dashboard/admin/blog");
      }
    } catch {
      toast.error("Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-white/20";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">
          {isEditing ? "Edit post" : "New post"}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={isSubmitting}
            className="rounded-full border border-white/12 px-5 py-2 text-sm font-medium text-white/50 hover:text-white hover:border-white/25 transition-all disabled:opacity-40"
          >
            Save draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={isSubmitting}
            className="rounded-full bg-white text-[#0e0e0e] px-6 py-2 text-sm font-bold hover:bg-white/90 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* Left: main content */}
        <div className="space-y-6">
          <input
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="Post title..."
            className="w-full bg-transparent text-3xl font-black text-white outline-none placeholder:text-white/15 border-b border-white/8 pb-4"
          />
          <input
            value={form.slug}
            onChange={(e) => setField("slug", e.target.value)}
            placeholder="url-slug (auto-generated if empty)"
            className="w-full bg-transparent text-xs text-white/25 outline-none placeholder:text-white/15 font-mono"
          />
          <textarea
            value={form.excerpt}
            onChange={(e) => setField("excerpt", e.target.value)}
            placeholder="Short excerpt shown in previews..."
            rows={2}
            className={`${inputCls} resize-none`}
          />
          <RichTextEditor
            value={form.content}
            onChange={(html) => setField("content", html)}
            placeholder="Start writing your post..."
          />
        </div>

        {/* Right: sidebar */}
        <div className="space-y-5">
          {/* Status */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">
              Settings
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setField("status", e.target.value as typeof form.status)
                }
                className={inputCls}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setField("isFeatured", e.target.checked)}
                className="h-4 w-4 accent-red-500"
              />
              <span className="text-sm text-white/50">
                Featured on homepage
              </span>
            </label>
          </div>

          {/* Cover image */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">
              Cover image
            </p>
            {form.coverImage && (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <NextImage
                  src={form.coverImage}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <label
              className={cn(
                "flex items-center justify-center rounded-xl border border-dashed border-white/10 px-4 py-3 text-xs text-white/30 hover:border-white/25 hover:text-white/60 transition-all cursor-pointer",
                coverUploading && "animate-pulse",
              )}
            >
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleCoverUpload(f);
                }}
              />
              {coverUploading
                ? "Uploading..."
                : form.coverImage
                  ? "Replace cover"
                  : "Upload cover"}
            </label>
          </div>

          {/* Category */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">
              Category
            </p>
            <select
              value={form.categoryId}
              onChange={(e) => setField("categoryId", e.target.value)}
              className={inputCls}
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-all",
                    selectedTagIds.includes(tag.id)
                      ? "bg-white text-[#0e0e0e]"
                      : "bg-white/5 border border-white/8 text-white/40 hover:text-white",
                  )}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
