"use client";

import { useState } from "react";
// import { Logo } from "./logo";
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

export function NavbarClient() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "About", link: "/about", number: "01" },
    { name: "Services", link: "/services", number: "02" },
    { name: "Works", link: "/gallery", number: "03" },
    { name: "Testimonials", link: "/testimonials", number: "04" },
    // ...(isAdmin ? [{ name: "Admin", link: "/admin/products" }] : []),
  ];

  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        {/* <div className="z-50 flex items-center gap-4">
          <ActionButtons user={user} isAdmin={isAdmin} />
        </div> */}
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
          {/* <div className="z-50 flex w-full flex-col gap-4">
            <ActionButtons user={user} isAdmin={isAdmin} />
          </div> */}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
