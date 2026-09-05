import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/ui/PageHero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Projects",
  description: "SPL Homes project gallery. Real case studies will replace the current sample content.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/projects", label: "Projects" }]} />
      <PageHero
        eyebrow="Projects"
        title="Work that will live here."
        lede="The gallery is ready. The real houses are not loaded yet. Cards are labelled SAMPLE CONTENT — they are not SPL Homes projects."
        primary={{ href: "/start-your-project", label: "Start your project" }}
      />
      <FeaturedProjects all />
      <CtaBand />
    </>
  );
}
