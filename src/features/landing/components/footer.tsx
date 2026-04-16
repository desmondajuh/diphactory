import { BUSINESS_NAME } from "@/constants";

export const Footer = () => {
  return (
    <footer className="relative py-6 min-h-[30vh] px-6 border-t border-accent-red bg-black text-white flex flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 top-0 z-0 w-full flex justify-center">
        <h1
          className="text-5xl select-none pointer-events-none leading-none tracking-tighter"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 11vw, 10rem)",
            lineHeight: 0.88,
            opacity: 0.015,
          }}
        >
          DIAI IMAGE PHACTORY
        </h1>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="font-serif text-2xl tracking-wide">
            {BUSINESS_NAME}
          </span>
        </div>
        <div className="flex gap-8 text-sm">
          <a
            href="/privacy"
            className="hover:text-accent-red transition-colors"
          >
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-accent-red transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-accent-red transition-colors">
            Contact Us
          </a>
        </div>
        <p className="text-sm">© 2026 {BUSINESS_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
};
