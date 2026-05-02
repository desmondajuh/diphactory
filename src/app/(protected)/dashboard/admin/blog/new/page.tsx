// app/(dashboard)/admin/blog/new/page.tsx
import { client } from "@/lib/orpc";
import { BlogEditorView } from "@/features/admin/views/blog-editor-view";

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    client.blog.listCategories(),
    client.blog.listTags(),
  ]);
  return <BlogEditorView post={null} categories={categories} tags={tags} />;
}
