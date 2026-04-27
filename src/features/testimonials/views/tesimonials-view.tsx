// import { testimonials } from "@/datas/testimonials";
import { client } from "@/lib/orpc";
import { TestimonialColumn } from "../components/testimonial-column";

function chunkArray<T>(arr: T[], num: number) {
  const result = [];
  const size = Math.ceil(arr.length / num);

  for (let i = 0; i < num; i++) {
    result.push(arr.slice(i * size, (i + 1) * size));
  }

  return result;
}

export default async function TestimonialsView() {
  const data = await client.testimonials.list();

  // map DB fields → what TestimonialCard expects
  const testimonials = data.map((t) => ({
    id: t.id,
    name: t.clientName,
    role: t.clientTitle ?? "",
    image: t.clientImage ?? "/images/fallback/avatar.png",
    quote: t.quote,
  }));

  const columns = chunkArray(testimonials, 4);

  return (
    <section className="min-h-screen bg-background text-foreground px-6 py-24">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <p className="text-accent-red text-sm uppercase tracking-widest">
          Testimonials
        </p>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          What Clients Say
        </h1>

        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Real stories. Real emotions. Real impact. Here’s what people
          experience working with DIP.
        </p>
      </div>

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
