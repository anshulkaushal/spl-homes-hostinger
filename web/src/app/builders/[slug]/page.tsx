import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation, locations } from "@/content/locations";
import { getService } from "@/content/services";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};
  return createMetadata({
    title: `Builders in ${location.name}`,
    description: location.lede,
    path: `/builders/${location.slug}`,
  });
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${location.region} · coverage to confirm`}
        title={`Building in ${location.name}`}
        lede={location.lede}
        primary={{ href: "/start-your-project", label: "Start your project" }}
        secondary={{ href: "/where-we-build", label: "All areas" }}
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5 text-lg leading-8 text-ink-soft">
          {location.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="bg-cream p-6">
          <h2 className="font-display text-2xl">Related services</h2>
          <ul className="mt-4 space-y-2">
            {location.services.map((slugValue) => {
              const service = getService(slugValue);
              return service ? (
                <li key={slugValue}>
                  <Link href={`/services/${service.slug}`} className="text-forest hover:underline">
                    {service.title}
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </aside>
      </Container>
      <CtaBand />
    </>
  );
}
