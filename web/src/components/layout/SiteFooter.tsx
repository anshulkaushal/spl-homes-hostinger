import Image from "next/image";
import Link from "next/link";
import { emailLabel, mailHref, nav, phoneLabel, site, telHref } from "@/content/site";
import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone bg-forest-deep text-cream">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="" width={32} height={32} />
            <span className="font-display text-xl">SPL Homes</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-cream/70">
            {site.tagline}
            <br />
            New homes, renovations and building projects in the Wellington region.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-timber">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/faq" className="hover:text-timber">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">Services</p>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className="hover:text-timber">
                  {service.navTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">Talk to us</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={telHref()} className="hover:text-timber">
                {phoneLabel()}
              </a>
            </li>
            <li>
              <a href={mailHref()} className="hover:text-timber">
                {emailLabel()}
              </a>
            </li>
            <li className="text-cream/60">
              {site.address || "Address to be added"}
              <br />
              {site.region}
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-timber">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-cream/45 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} SPL Homes. All rights reserved.</p>
        <p className="flex gap-4">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </p>
      </Container>
    </footer>
  );
}
