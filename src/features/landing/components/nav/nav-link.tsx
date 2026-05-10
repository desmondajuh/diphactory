"use client";

import Link from "next/link";

interface NavLinkProps {
  href: string;
  label: string;
  number: string;
  className?: string;
}

export function NavLink({ href, label, number, className = "" }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`group relative flex items-start gap-0.5 text-sm font-medium tracking-wide text-(--color-nav-link) transition-colors duration-200 hover:text-accent-brand ${className}`}
    >
      <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
        {label}
      </span>
      <sup className="text-[9px] font-semibold leading-none text-(--color-text-muted) transition-colors duration-200 group-hover:text-accent-brand">
        {number}
      </sup>
    </Link>
  );
}
