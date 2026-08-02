import Link from "next/link";
import { Code2, Menu } from "lucide-react";
import { Brand } from "@/components/brand";

const links = [
  { href: "/setup", label: "Setup" },
  { href: "/check", label: "Check a domain" },
  { href: "/tools/logo", label: "Logo tool" },
  { href: "/providers", label: "Providers" },
  { href: "/learn", label: "Learn" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link href={link.href} key={link.href}>
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
        <details className="mobile-menu">
          <summary aria-label="Open navigation">
            <Menu size={22} aria-hidden="true" />
          </summary>
          <nav aria-label="Mobile navigation">
            {links.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
            <a href="https://github.com/suped-com/openbimi">View on GitHub</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
