"use client";

import Link from "next/link";
import { Code2, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Brand } from "@/components/brand";

const links = [
  { href: "/setup", label: "Setup" },
  { href: "/check", label: "Check a domain" },
  { href: "/tools/logo", label: "Logo tool" },
  { href: "/providers", label: "Providers" },
  { href: "/learn", label: "Learn" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link href={link.href} key={link.href} aria-current={isActive(link.href) ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <a
          className="github-button"
          href="https://github.com/suped-com/openbimi"
          target="_blank"
          rel="noreferrer"
        >
          <Code2 size={17} aria-hidden="true" />
          <span>GitHub</span>
        </a>
        <details className="mobile-menu" ref={mobileMenu} onToggle={(event) => setMenuOpen(event.currentTarget.open)}>
          <summary aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
            <span className={`mobile-menu-icons${menuOpen ? " is-open" : ""}`} aria-hidden="true">
              <Menu className="mobile-menu-icon mobile-menu-icon--open" size={22} />
              <X className="mobile-menu-icon mobile-menu-icon--close" size={22} />
            </span>
          </summary>
          <nav aria-label="Mobile navigation">
            {links.map((link) => (
              <Link href={link.href} key={link.href} aria-current={isActive(link.href) ? "page" : undefined} onClick={() => { mobileMenu.current?.removeAttribute("open"); setMenuOpen(false); }}>
                {link.label}
              </Link>
            ))}
            <a href="https://github.com/suped-com/openbimi" target="_blank" rel="noreferrer">View on GitHub</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
