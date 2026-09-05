import { CtaBand } from "@/components/ui/CtaBand";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Placeholder } from "@/components/ui/Placeholder";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About SPL Homes",
  description: "A Wellington building company for new homes, renovations and development — personal service, professional delivery.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Your vision. Built properly."
        lede="SPL Homes is a New Zealand residential building company working across the Wellington region. We want the work to feel personal without looking amateur."
        primary={{ href: "/start-your-project", label: "Start your project" }}
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-2">
        <div className="space-y-5 text-lg leading-8 text-ink-soft">
          <p>
            The people who live in a house should be able to follow the building of it. That is the
            standard. Clear communication, a tidy site, and a finish that belongs in this climate.
          </p>
          <p>
            We work with homeowners, investors and developers. Some people arrive with a full drawing
            set. Some arrive with a section and a feeling. Both are a valid start.
          </p>
          <p>
            Company history, team biographies, years in operation and any memberships will be
            published here only when they are supplied. This page will not invent them.
          </p>
        </div>
        <div className="space-y-3">
          <Placeholder>Founder / team profiles to be added.</Placeholder>
          <Placeholder>Years in operation to be added if confirmed.</Placeholder>
          <Placeholder>Memberships and certifications to be added if held.</Placeholder>
          <Placeholder>Studio or yard address to be added.</Placeholder>
        </div>
      </Container>
      <CtaBand secondary={{ href: "/process", label: "See how we build" }} />
    </>
  );
}
