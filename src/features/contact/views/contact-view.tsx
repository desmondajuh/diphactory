// "use client";

import { ReactLenis } from "lenis/react";
import { PageHero } from "@/components/shared/page-hero";
import { PageHeroTwo } from "@/components/shared/heros/page-hero-two";
import { client } from "@/lib/orpc";
import { ContactSection } from "../components/contact-section";

export default async function ContactView() {
  const [ContactHeroData, ContactHeaderData] = await Promise.all([
    client.sections.getBySlug({ slug: "contact-hero" }),
    client.sections.getBySlug({ slug: "contact-page-header" }),
  ]);

  // const subtitleObj = splitWordBalanced(ContactHeaderData?.subtitle || "sub title");

  return (
    <ReactLenis root>
      <div className="min-h-screen relative overflow-hidden">
        {/* Grain */}
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.03] z-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Hero */}
        {/* <PageHero title="Contact DIP" /> */}
        <PageHero
          badge={ContactHeroData?.badge || "©2026"}
          title={ContactHeroData?.title || "About Dip"}
          pageDesc={ContactHeroData?.subtitle || "About Dip"}
          imageSrc={ContactHeroData?.image || "images/bg/bride-portrait.jpg"}
        />
        <div className="max-w-7xl mx-auto min-h-screen">
          {/* div className="min-h-screen bg-background text-foreground" */}
          {/* ── PAGE HEADER ── */}
          <PageHeroTwo
            label={ContactHeaderData?.title || "CONTACT US"}
            badge={ContactHeaderData?.badge || "Available for bookings"}
            title={ContactHeaderData?.subtitle || ""}
            subTitle={
              ContactHeaderData?.description ||
              "Every great image starts with a conversation. Tell me about your vision and let's make it real."
            }
            badgeActive
            variant="left"
          />
          <ContactSection />
        </div>
      </div>
    </ReactLenis>
  );
}
