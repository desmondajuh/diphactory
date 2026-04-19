"use client";

import { ReactLenis } from "lenis/react";
import { PageHero } from "@/components/shared/page-hero";
import { Contact2 } from "./contact2";

export default function ContactView() {
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
        <PageHero title="Contact DIP" />
        <div className="max-w-7xl mx-auto">
          <Contact2 />
        </div>
      </div>
    </ReactLenis>
  );
}
