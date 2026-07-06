"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Home", meta: "f/1.4" },
  { href: "/portfolio", label: "Portfólio", meta: "f/2.0" },
  { href: "/valores", label: "Valores", meta: "f/2.8" },
  { href: "/contato", label: "Contato", meta: "f/4.0" },
];

export default function SiteNav({ logoUrl }: { logoUrl: string }) {
  const pathname = usePathname();
  const [focused, setFocused] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-panel-2 bg-background/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          onMouseEnter={() => setFocused("brand")}
          onMouseLeave={() => setFocused(null)}
          className="shrink-0 transition-[filter,opacity] duration-300"
          style={{
            filter: focused && focused !== "brand" ? "blur(3px)" : "blur(0px)",
            opacity: focused && focused !== "brand" ? 0.45 : 1,
          }}
        >
          <Image src={logoUrl} alt="SCCHER" width={440} height={669} className="h-9 w-auto md:h-10" priority />
        </Link>

        {/* Desktop nav (large screens only) */}
        <nav
          className="hidden items-center gap-1 lg:flex lg:gap-2"
          onMouseLeave={() => setFocused(null)}
        >
          {LINKS.map((link) => {
            const active = pathname === link.href;
            const isFocused = focused === link.href;
            const isBlurred = focused !== null && focused !== link.href && focused !== "brand";
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setFocused(link.href)}
                className="group relative px-4 py-2 text-xs uppercase tracking-[0.25em] transition-[filter,opacity] duration-300"
                style={{
                  filter: isBlurred ? "blur(3px)" : "blur(0px)",
                  opacity: isBlurred ? 0.4 : 1,
                }}
              >
                <span className={active ? "text-foreground" : "text-muted group-hover:text-foreground"}>
                  {link.label}
                </span>
                {isFocused && (
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] tracking-widest text-muted">
                    {link.meta}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="ml-4 border-l border-panel-2 pl-4">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile/tablet controls */}
        <div className="flex shrink-0 items-center gap-4 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className="flex items-center gap-2"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-muted">Site</span>
            <span className="flex h-8 w-8 flex-col items-center justify-center gap-[5px]">
              <span
                className={`h-px w-5 bg-foreground transition-transform duration-200 ${
                  menuOpen ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-5 bg-foreground transition-transform duration-200 ${
                  menuOpen ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile/tablet menu panel */}
      {menuOpen && (
        <nav className="flex flex-col border-t border-panel-2 px-6 py-2 lg:hidden">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-xs uppercase tracking-[0.3em]"
              >
                <span className={active ? "text-foreground" : "text-muted"}>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
