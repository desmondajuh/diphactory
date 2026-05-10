import { ReactLenis } from "lenis/react";
import { PageHero } from "@/components/shared/page-hero";
import { ImageCTA } from "@/components/shared/image-cta";
import { FAQSection } from "@/features/landing/sections/faq-section";
import LatestInsights from "@/features/landing/sections/insights-section";
import { ExpertiseSection } from "@/features/about/sections/expertise-section";
import { client } from "@/lib/orpc";

export default async function AboutPage() {
  // const faqs = await client.faq.list();
  const [
    faqs,
    featuredPosts,
    insightData,
    aboutHeroData,
    aboutMeData,
    aboutCtaData,
  ] = await Promise.all([
    client.faq.list(),
    client.blog.listFeatured(),
    client.sections.getBySlug({ slug: "posts-section" }),
    client.sections.getBySlug({ slug: "about-hero" }),
    client.sections.getBySlug({ slug: "about-me-main" }),
    client.sections.getBySlug({ slug: "home-cta-main" }),
  ]);
  return (
    <ReactLenis root>
      <div className="min-h-screen bg-[#0e0e0e] text-white relative overflow-hidden">
        {/* Grain */}
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.03] z-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Hero */}
        <PageHero
          title={aboutHeroData?.title || "About Dip"}
          imageSrc={aboutHeroData?.image || "images/bg/bride-portrait.jpg"}
        />
        <ExpertiseSection sectionData={aboutMeData} />
        <FAQSection faqs={faqs} />
        <ImageCTA
          title={aboutCtaData?.title || ""}
          subtitle={aboutCtaData?.subtitle || ""}
          ctaText={aboutCtaData?.ctaText || ""}
          ctaLink={aboutCtaData?.ctaLink || ""}
          className="bg-accent-brand-950"
        />
        <LatestInsights sectionData={insightData} posts={featuredPosts} />
      </div>
    </ReactLenis>
  );
}
