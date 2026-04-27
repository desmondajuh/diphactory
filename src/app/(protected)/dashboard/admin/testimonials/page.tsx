// app/(dashboard)/admin/testimonials/page.tsx
import { client } from "@/lib/orpc";
import { TestimonialsAdminView } from "@/features/admin/views/testimonials-admin-view";

export default async function TestimonialsAdminPage() {
  const testimonials = await client.testimonials.listAll();
  return <TestimonialsAdminView initialTestimonials={testimonials} />;
}
