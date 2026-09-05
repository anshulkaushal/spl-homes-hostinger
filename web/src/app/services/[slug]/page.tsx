import { notFound } from "next/navigation";
import { ViewTracker } from "@/components/analytics/ViewTracker";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getService, services } from "@/content/services";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return createMetadata({
    title: `${service.title} in Wellington`,
    description: service.lede,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <ViewTracker event="service_viewed" payload={{ slug: service.slug }} />
      <Breadcrumbs
        items={[
          { href: "/services", label: "Services" },
          { href: `/services/${service.slug}`, label: service.title },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.lede,
          areaServed: "Wellington region, New Zealand",
          provider: { "@type": "HomeAndConstructionBusiness", name: "SPL Homes" },
        }}
      />
      <PageHero
        eyebrow={service.eyebrow}
        title={service.title}
        lede={service.lede}
        primary={service.cta}
        secondary={{ href: "/projects", label: "View our projects" }}
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5 text-lg leading-8 text-ink-soft">
          {service.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="space-y-6">
          <div className="bg-cream p-6">
            <h2 className="font-display text-2xl">Who this is for</h2>
            <p className="mt-3 text-ink-soft">{service.who}</p>
          </div>
          <div className="bg-cream p-6">
            <h2 className="font-display text-2xl">What you can expect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-soft">
              {service.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </Container>
      <CtaBand primary={service.cta} />
    </>
  );
}
