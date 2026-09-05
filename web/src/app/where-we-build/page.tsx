import Link from "next/link";
import { coverageAreas, locations } from "@/content/locations";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Where we build",
  description: "SPL Homes is focused on the Wellington region. Coverage areas are configurable and not all are confirmed yet.",
  path: "/where-we-build",
});

export default function WhereWeBuildPage() {
  return (
    <>
      <PageHero
        eyebrow="Wellington region"
        title="Check whether we can help."
        lede="These places are the market we are building the site around. They are not a promise of coverage until SPL Homes confirms them."
        primary={{ href: "/start-your-project", label: "Start your project" }}
      />
      <Container className="py-16">
        <ul className="grid gap-4 md:grid-cols-2">
          {coverageAreas.map((area) => (
            <li key={area.name} className="border border-stone bg-cream p-6">
              <h2 className="font-display text-2xl">{area.name}</h2>
              <p className="mt-2 text-sm text-ink-soft">Coverage to be confirmed.</p>
              {area.slug ? (
                <Link href={`/builders/${area.slug}`} className="mt-4 inline-block text-sm font-semibold text-forest">
                  Building in {area.name} →
                </Link>
              ) : (
                <p className="mt-4 text-sm text-ink-soft">A dedicated page will be added when there is unique content.</p>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-ink-soft">
          Longer notes currently exist for {locations.map((location) => location.name).join(", ")}.
        </p>
      </Container>
      <CtaBand primary={{ href: "/start-your-project", label: "Check your area" }} />
    </>
  );
}
