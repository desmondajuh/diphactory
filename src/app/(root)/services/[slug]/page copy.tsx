import { notFound } from "next/navigation";
import { services } from "@/lib/data/services";

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) return notFound();

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      {/* HERO */}
      <div className="px-6 md:px-10 py-24 max-w-5xl mx-auto">
        <p className="text-xs uppercase text-white/40 mb-3">
          {service.tagline}
        </p>
        <h1 className="text-5xl font-black leading-none">
          {service.title}
          <span className="text-[var(--color-accent-red)]">*</span>
        </h1>
        <p className="mt-6 text-white/50 max-w-2xl">{service.description}</p>
      </div>

      {/* CASE STUDY */}
      <div className="px-6 md:px-10 pb-24 max-w-5xl mx-auto space-y-12">
        <Section title="Overview" text={service.caseStudy.overview} />
        <Section title="Challenge" text={service.caseStudy.challenge} />
        <Section title="Solution" text={service.caseStudy.solution} />
        <Section title="Result" text={service.caseStudy.result} />
      </div>

      {/* CTA */}
      <div className="px-6 md:px-10 pb-32 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black">Ready to create?*</h2>
        <p className="text-white/50 mt-3">
          Let’s bring your vision to life with intention and precision.
        </p>
      </div>
    </div>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="text-sm uppercase tracking-widest text-white/40 mb-3">
        {title}
      </h3>
      <p className="text-white/70 leading-relaxed">{text}</p>
    </div>
  );
}
