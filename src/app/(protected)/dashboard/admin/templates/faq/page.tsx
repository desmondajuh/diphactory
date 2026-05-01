// app/(dashboard)/admin/templates/faq/page.tsx
import { FaqAdminView } from "@/features/admin/views/faq-admin-view";
import { client } from "@/lib/orpc";
// import { FaqAdminView } from "@/features/admin/views/faq-admin-view";

export default async function FaqAdminPage() {
  const faqs = await client.faq.listAll();
  return <FaqAdminView initialFaqs={faqs} />;
}
