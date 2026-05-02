// app/(dashboard)/admin/blog/page.tsx
import { client } from "@/lib/orpc";
import { BlogAdminView } from "@/features/admin/views/blog-admin-view";

export default async function BlogAdminPage() {
  const [posts, categories, tags] = await Promise.all([
    client.blog.listAll(),
    client.blog.listCategories(),
    client.blog.listTags(),
  ]);
  return (
    <BlogAdminView initialPosts={posts} categories={categories} tags={tags} />
  );
}
