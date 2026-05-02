// app/(public)/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { client } from "@/lib/orpc";
import { BlogPostView } from "@/features/blog/views/blog-post-view";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.blog.getBySlug({ slug }).catch(() => null);
  if (!post) notFound();
  return <BlogPostView post={post} />;
}
