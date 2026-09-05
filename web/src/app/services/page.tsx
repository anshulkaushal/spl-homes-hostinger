import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ServiceCard } from "@/components/services/ServiceCard";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { services } from "@/content/services";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Building services in Wellington",
  description:
    "New homes, renovations, extensions, design and build, knockdown rebuilds, development and commercial work with SPL Homes.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/services", label: "Services" }]} />
      <PageHero
        eyebrow="Services"
        title="What we can build with you."
        lede="Seven clear starting points. If you are not sure which one you need, start a project and say so."
        primary={{ href: "/start-your-project", label: "Start your project" }}
      />
      <Container className="grid gap-6 py-16 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </Container>
      <CtaBand />
    </>
  );
}
