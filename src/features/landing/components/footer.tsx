import { SiteConfig } from "@/lib/db/schema/site-config";

// components/sections/footer-section.tsx
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { Logo } from "@/components/shared/logo";

interface Props {
  config: SiteConfig;
}

// export function Footer3({ config }: Props) {
//   return (
//     <footer>
//       <p>{config.businessName}</p>
//       <a href={`mailto:${config.email}`}>{config.email}</a>
//       <a href={`tel:${config.phone}`}>{config.phone}</a>
//       {config.instagram && (
//         <a href={config.instagram} target="_blank">
//           Instagram
//         </a>
//       )}
//     </footer>
//   );
// }

export const Footer = ({ config }: Props) => {
  return (
    <>
      <FooterSection config={config} />
      <div className="flex items-center justify-between border-t border-border px-6 py-4 md:px-10 text-xs text-muted-foreground">
        <p className="text-xs text-muted-foreground">
          © 2026 {config.businessName}. All rights reserved.
        </p>
        {/* <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="text-accent-brand">⚡</span>
          Typically responds within 24–48 hours
        </span> */}
        <div className="flex items-center gap-8">
          <Link href="#" className="transition hover:text-primary">
            Privacy Policy
          </Link>

          <Link href="#" className="transition hover:text-primary">
            Terms of Service
          </Link>
        </div>
      </div>
    </>
  );
};

const navigation = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "/" },
      { label: "Portfolio", href: "/gallery" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Updates", href: "/blog" },
      { label: "Contact", href: "contact" },
    ],
  },
];

export function FooterSection({ config }: Props) {
  const socials = [
    {
      icon: FaInstagram,
      href: config.instagram,
    },
    {
      icon: FaFacebookF,
      href: config.facebook,
    },
    {
      icon: FaTwitter,
      href: config.twitter,
    },
    {
      icon: FaYoutube,
      href: config.youtube,
    },
  ];
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-background text-accent-brand-100">
      {/* subtle texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#b9862b15_0%,transparent_40%)]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        {/* TOP */}
        <div className="grid grid-cols-1 gap-14 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div>
            {/* logo */}
            <div className="flex items-center gap-3">
              {/* <div className="relative h-10 w-10 rounded-full bg-primary/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-5 w-5 rounded-full bg-primary" />
                </div>
              </div> */}
              <Logo className="text-accent-brand-900" />
            </div>

            <p className="mt-5 max-w-xs">
              {config.description ||
                "Capturing moments. Creating stories. Preserving memories."}
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <h3 className="text-lg font-bold uppercase font-heading2 tracking-[0.18em] text-accent-brand-900">
              Navigation
            </h3>

            <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-4">
              {navigation[0].links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-base transition hover:text-accent-brand-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* SOCIALS */}
          <div>
            <h3 className="text-lg font-bold uppercase font-heading2 tracking-[0.18em] text-accent-brand-900">
              Follow Us
            </h3>

            <div className="mt-6 flex items-center gap-4">
              {socials.map((social, idx) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={idx}
                    href={social.href || "#"}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-accent-brand-900 text-accent-brand-900 transition duration-300 hover:bg-accent-brand-950 hover:text-accent-brand-500"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-bold uppercase font-heading2 tracking-[0.18em] text-accent-brand-900">
              Contact
            </h3>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-3">
                <Mail
                  className="mt-1 h-5 w-5 text-accent-brand-900"
                  strokeWidth={1.8}
                />

                <p className="text-base">{config.email}</p>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  className="mt-1 h-5 w-5 text-accent-brand-900"
                  strokeWidth={1.8}
                />

                <p className="text-base">{config.phone}</p>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-1 h-5 w-5 text-accent-brand-900"
                  strokeWidth={1.8}
                />

                <p className="text-base capitalize">
                  {config.city}, {config.country}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
