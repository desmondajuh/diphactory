// app/(dashboard)/admin/templates/sections/page.tsx
import { client } from "@/lib/orpc";
import { SectionsAdminView } from "@/features/admin/views/sections-admin-view";

export default async function SectionsAdminPage() {
  const sections = await client.sections.listAll();
  return <SectionsAdminView initialSections={sections} />;
}
