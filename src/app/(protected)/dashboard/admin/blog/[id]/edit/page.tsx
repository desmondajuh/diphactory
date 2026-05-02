// app/(dashboard)/admin/blog/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { client } from "@/lib/orpc";
import { BlogEditorView } from "@/features/admin/views/blog-editor-view";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories, tags] = await Promise.all([
    client.blog.getByIdAdmin({ id }).catch(() => null),
    client.blog.listCategories(),
    client.blog.listTags(),
  ]);
  if (!post) notFound();
  return <BlogEditorView post={post} categories={categories} tags={tags} />;
}
