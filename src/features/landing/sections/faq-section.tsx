"use client";

import { SectionBadge } from "@/components/shared/section-badge";
import { SectionTitle, SectionTitle2 } from "@/components/shared/section-title";
import { useState } from "react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: "01",
    question: "What does a project look like?",
    answer:
      "Every project starts with a discovery call where we map out your goals, timeline, and deliverables. From there we move into design, development, and a structured review phase — all managed in a shared workspace so you always know what's happening and what's next.",
  },
  {
    id: "02",
    question: "How is the pricing structure?",
    answer:
      "We offer both fixed-price packages for well-defined scopes and a monthly retainer for ongoing work. All pricing is transparent and agreed upfront — no surprise invoices. You'll receive a detailed proposal before any work begins.",
  },
  {
    id: "03",
    question: "Are all projects fixed scope?",
    answer:
      "Not at all. Fixed scope works well for discrete deliverables like a landing page or a specific feature. For evolving products or continuous improvement work, a flexible retainer is usually a better fit. We'll recommend whichever model suits your situation.",
  },
  {
    id: "04",
    question: "What is the ROI?",
    answer:
      "ROI varies by project type, but our clients typically see measurable improvements in conversion rate, page performance, and time-to-launch within the first 90 days. We set clear success metrics at the start of every engagement so we can track impact together.",
  },
  {
    id: "05",
    question: "How do we measure success?",
    answer:
      "We define KPIs together before the project kicks off — things like load time, conversion rate, bounce rate, or task completion depending on your goals. We review these at each milestone and again at project close to make sure we've hit the mark.",
  },
  {
    id: "06",
    question: "What do I need to get started?",
    answer:
      "Just a rough idea of what you're trying to achieve. We'll handle the rest in our first call. If you have existing brand assets, copy, or a reference site you like, bring those along — but they're not required to get the conversation going.",
  },
  {
    id: "07",
    question: "How easy is it to edit for beginners?",
    answer:
      "Very easy. We build on modern CMS platforms with visual editors so you can update text, images, and layout without touching code. We also provide a short handover walkthrough and written documentation tailored to your specific setup.",
  },
  {
    id: "08",
    question: "Do I need to know how to code?",
    answer:
      "No. Everything we deliver is designed to be managed by non-technical team members day-to-day. If you ever want to go deeper under the hood, the codebase is clean and well-documented — but you'll never need to in order to run your site.",
  },
];

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="w-full px-8 py-16 bg-white">
      <div className="max-w-6xl w-full mx-auto">
        {/* Top border */}
        <div className="border-t border-gray-200 mb-12" />

        <div className="flex gap-8">
          {/* Left label */}
          <div className="w-auto shrink-0 flex items-start gap-2 pt-1">
            <div className="flex flex-col">
              <SectionBadge label="FAQ" className="w-fit" />
              <div className="flex">
                <SectionTitle title="Answers" className="text-black" />
                <span
                  className="text-accent-red"
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
            {faqs.map((faq) => (
              <div key={faq.id}>
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center gap-12 py-5 text-left group"
                >
                  {/* Number */}
                  <span className="w-8 shrink-0 text-sm text-gray-400 font-normal tracking-wide">
                    {faq.id}
                  </span>

                  {/* Question */}
                  <span className="flex-1 text-[15px] text-gray-800 font-normal">
                    {faq.question}
                  </span>

                  {/* Plus / Minus icon */}
                  <span className="shrink-0 text-gray-800 leading-none">
                    {openId === faq.id ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <line
                          x1="2"
                          y1="9"
                          x2="16"
                          y2="9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <line
                          x1="9"
                          y1="2"
                          x2="9"
                          y2="16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="2"
                          y1="9"
                          x2="16"
                          y2="9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </span>
                </button>

                {/* Answer panel */}
                {openId === faq.id && (
                  <div className="pl-20 pb-6 text-[14px] text-gray-500 leading-relaxed max-w-2xl">
                    {faq.answer}
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
