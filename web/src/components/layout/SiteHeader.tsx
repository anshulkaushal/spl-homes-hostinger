"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { nav } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuId = useId();
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setServicesOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-stone/80 bg-paper/95">
      <Container className="flex h-16 items-center justify-between gap-6 sm:h-[4.5rem]">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/logo.svg" alt="" width={36} height={36} />
          <span className="font-display text-xl tracking-tight">SPL Homes</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {nav.map((item) =>
            "children" in item ? (
              <div
                key={item.href}
                ref={servicesRef}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  type="button"
                  className={cn(
                    "text-sm font-medium text-ink-soft hover:text-ink",
                    pathname.startsWith("/services") && "text-ink",
                  )}
                  aria-expanded={servicesOpen}
                  aria-controls={menuId}
                  onClick={() => setServicesOpen(true)}
                >
                  {item.label}
                </button>
                {servicesOpen ? (
                  <div id={menuId} className="absolute left-0 top-full z-20 min-w-56 border border-stone bg-cream py-3 shadow-sm">
                    <Link
                      href={item.href}
                      className="block px-4 py-2 text-sm text-ink-soft hover:bg-paper hover:text-ink"
                      onClick={() => setServicesOpen(false)}
                    >
                      All services
                    </Link>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-ink-soft hover:bg-paper hover:text-ink"
                        onClick={() => setServicesOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-ink-soft hover:text-ink",
                  pathname === item.href && "text-ink",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden lg:block">
          <Button href="/start-your-project" className="min-h-11 px-5 text-xs">
            Start your project
          </Button>
        </div>

        <button
          type="button"
          className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="block h-px w-6 bg-ink" />
          <span className="block h-px w-6 bg-ink" />
          <span className="block h-px w-6 bg-ink" />
        </button>
      </Container>

      {open ? (
        <div id="mobile-nav" className="border-t border-stone bg-cream lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <div key={item.href}>
                <Link href={item.href} className="block py-3 text-base" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
                {"children" in item
                  ? item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-2 pl-4 text-sm text-ink-soft"
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))
                  : null}
              </div>
            ))}
            <Button href="/start-your-project" className="mt-3" onClick={() => setOpen(false)}>
              Start your project
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
