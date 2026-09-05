import { services } from "@/content/services";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Section } from "@/components/ui/Section";

export function HomeServices() {
  return (
    <Section className="bg-cream">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Services</Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl">What we can build with you.</h2>
          <p className="mt-4 max-w-xl text-ink-soft">
            Seven starting points. If you are not sure which one you need, start a project and say so.
          </p>
        </div>
        <Button href="/services" variant="outline">
          All services
        </Button>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </Section>
  );
}
