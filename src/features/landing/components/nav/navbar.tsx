"use client";

import { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/features/landing/components/nav/resizable-navbar";
import Link from "next/link";
import { Logo } from "./logo";
import { ActionButtons } from "./action-buttons";
// import { useSession } from "@/lib/auth-client";

interface NavbarClientProps {
  isLoggedIn?: boolean;
  role?: string;
}

export function NavbarClient({ isLoggedIn, role }: NavbarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "About", link: "/about", number: "01" },
    { name: "Services", link: "/services", number: "02" },
    { name: "Works", link: "/gallery", number: "03" },
    { name: "Testimonials", link: "/testimonials", number: "04" },
    { name: "Contact", link: "/contact", number: "05" },
    // ...(isAdmin ? [{ name: "Admin", link: "/admin/products" }] : []),
  ];

  return (
    <Navbar>
      <NavBody>
        {/* <NavbarLogo /> */}
        <Logo />
        <NavItems items={navItems} />
        <div className="z-50 flex items-center gap-4">
          <ActionButtons isLoggedIn={isLoggedIn} role={role} />
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </Link>
          ))}
          <div className="z-50 flex w-full flex-col gap-4">
            <ActionButtons isLoggedIn={isLoggedIn} role={role} />
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
