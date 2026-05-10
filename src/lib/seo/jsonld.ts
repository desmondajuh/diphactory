// lib/seo/jsonld.ts

import type { SiteConfig } from "@/lib/db/schema";

export function buildJsonLd(config: SiteConfig | null, url: string) {
  if (!config) return null;

  const addressParts = [config.address, config.city, config.country]
    .filter(Boolean)
    .join(", ");

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",

    name: config.businessName,
    url,

    ...(config.logoUrl && { image: config.logoUrl }),

    ...(config.email && { email: config.email }),
    ...(config.phone && { telephone: config.phone }),

    ...(addressParts && {
      address: {
        "@type": "PostalAddress",
        streetAddress: config.address,
        addressLocality: config.city,
        addressCountry: config.country,
      },
    }),

    sameAs: [
      config.instagram,
      config.facebook,
      config.twitter,
      config.youtube,
      config.tiktok,
      config.linkedin,
    ].filter(Boolean),
  };
}
