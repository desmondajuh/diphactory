"use client";

import { SectionBadge } from "@/components/shared/section-badge";
import { SectionTitle } from "@/components/shared/section-title";
import { useState } from "react";
import { Faq } from "@/lib/db/schema";
import { MinusIcon, PlusIcon } from "lucide-react";

interface FAQSectionProps {
  faqs: Faq[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="w-full px-8 py-16 bg-accent-brand-50/5">
      <div className="max-w-6xl w-full mx-auto">
        {/* Top border */}
        {/* <div className="border-t border-gray-200 mb-12" /> */}

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Left label */}
          <div className="w-auto shrink-0 flex items-start gap-2 pt-1">
            <div className="flex flex-col">
              <SectionBadge label="FAQ" className="w-fit" />
              <div className="flex">
                <SectionTitle
                  title="Answers"
                  className="text-accent-brand-100"
                />
                <span
                  className="text-accent-brand"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(4rem, 14vw, 13rem)",
                    lineHeight: 0.88,
                  }}
                >
                  *
                </span>
              </div>
            </div>
          </div>

          {/* FAQ rows */}
          <div className="flex-1">
            {faqs.map((faq, idx) => (
              <div key={faq.id}>
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center gap-12 py-5 text-left group"
                >
                  {/* Number */}
                  <span className="w-8 shrink-0 text-sm text-gray-400 font-normal tracking-wide">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  {/* Question */}
                  <span className="flex-1 text-[15px] text-accent-brand-50 font-normal">
                    {faq.question}
                  </span>

                  {/* Plus / Minus icon */}
                  <span className="shrink-0 text-accent-brand-50 hover:text-accent-brand-500 cursor-pointer leading-none">
                    {openId === faq.id ? <MinusIcon /> : <PlusIcon />}
                  </span>
                </button>

                {/* Answer panel */}
                {openId === faq.id && (
                  <div className="pl-20 pb-6 text-[14px] text-gray-400 leading-relaxed max-w-2xl">
                    {faq.answer}
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-accent-brand-200/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
