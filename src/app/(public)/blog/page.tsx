// app/(public)/blog/page.tsx
import { client } from "@/lib/orpc";
import { BlogListView } from "@/features/blog/views/blog-list-view";

export default async function BlogPage() {
  const [posts, categories, tags] = await Promise.all([
    client.blog.listPublished(),
    client.blog.listCategories(),
    client.blog.listTags(),
  ]);
  return <BlogListView posts={posts} categories={categories} tags={tags} />;
}
