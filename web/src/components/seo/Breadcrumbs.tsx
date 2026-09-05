import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { absoluteUrl } from "@/lib/seo";

export type Crumb = { href: string; label: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ href: "/", label: "Home" }, ...items];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            item: absoluteUrl(item.href),
          })),
        }}
      />
      <nav aria-label="Breadcrumb" className="border-b border-stone/70 bg-paper">
        <Container className="flex flex-wrap gap-2 py-3 text-sm text-ink-soft">
          {trail.map((item, index) => (
            <span key={item.href} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {index === trail.length - 1 ? (
                <span className="text-ink">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </Container>
      </nav>
    </>
  );
}
