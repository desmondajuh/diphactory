// import { testimonials } from "@/datas/testimonials";
import { client } from "@/lib/orpc";
import { TestimonialColumn } from "../components/testimonial-column";
import { SectionHeader } from "@/components/shared/section-header";

function chunkArray<T>(arr: T[], num: number) {
  const result = [];
  const size = Math.ceil(arr.length / num);

  for (let i = 0; i < num; i++) {
    result.push(arr.slice(i * size, (i + 1) * size));
  }

  return result;
}

export default async function TestimonialsView() {
  const [TestimonialHeroData, testimonialData] = await Promise.all([
    client.sections.getBySlug({ slug: "testimonial-section-header" }),
    client.testimonials.list(),
  ]);

  // map DB fields → what TestimonialCard expects
  const testimonials = testimonialData.map((t) => ({
    id: t.id,
    name: t.clientName,
    role: t.clientTitle ?? "",
    image: t.clientImage ?? "/images/fallback/avatar.png",
    quote: t.quote,
  }));

  const columns = chunkArray(testimonials, 4);

  return (
    <section className="min-h-screen bg-background text-foreground px-6 py-24">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Header */}
      <SectionHeader
        variant="center"
        badge={TestimonialHeroData?.badge || "Testimonials"}
        title={TestimonialHeroData?.title || "What Clients Say"}
        subtitle={
          TestimonialHeroData?.subtitle ||
          "Real stories. Real emotions. Real impact. Here’s what people experience working with DIP."
        }
      />

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto h-[70vh]">
        <TestimonialColumn items={columns[0]} direction="up" speed={35} />
        <TestimonialColumn items={columns[1]} direction="down" speed={40} />
        <TestimonialColumn items={columns[2]} direction="up" speed={45} />
        <TestimonialColumn items={columns[3]} direction="down" speed={50} />
      </div>
    </section>
  );
}
