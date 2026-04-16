"use client";

import { useState } from "react";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";

const NAV_ITEMS = [
  { href: "/about", label: "About", number: "01" },
  { href: "/services", label: "Services", number: "02" },
  { href: "/works", label: "Works", number: "03" },
  { href: "/testimonials", label: "Testimonials", number: "04" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-10 lg:px-14"
      style={{ height: "var(--nav-height)" }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Logo />

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8 lg:gap-10 text-gray-300 ">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href + item.label}
            href={item.href}
            label={item.label}
            number={item.number}
          />
        ))}

        {/* CTA Button */}
        <a
          href="/contact"
          className="group flex items-center gap-2.5 rounded-full border border-accent-red bg-accent-red px-3 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-transparent hover:text-white"
          aria-label="Get in touch"
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:bg-accent-red group-hover:border group-hover:border-white"
            aria-hidden="true"
          >
            <svg
              className="h-3 w-3 text-accent-red transition-colors duration-300 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </span>
          Get in touch
        </a>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="flex md:hidden flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span
          className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-(--nav-height) left-0 right-0 bg-(--color-bg-secondary)/95 backdrop-blur-md flex flex-col gap-6 px-6 py-8 md:hidden border-t border-border)">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href + item.label}
              href={item.href}
              label={item.label}
              number={item.number}
              className="text-lg"
            />
          ))}
          <a
            href="/contact"
            className="mt-2 inline-flex w-fit items-center gap-2.5 rounded-full bg-(--color-accent-red) px-5 py-2.5 text-sm font-semibold text-white"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
              <svg
                className="h-3 w-3 text-accent-red"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
            Get in touch
          </a>
        </div>
      )}
    </nav>
  );
}
