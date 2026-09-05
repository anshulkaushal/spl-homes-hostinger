import { notFound } from "next/navigation";
import { ViewTracker } from "@/components/analytics/ViewTracker";
import { Gallery } from "@/components/media/Gallery";
import { HeroImage } from "@/components/media/HeroImage";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container } from "@/components/ui/Container";
import { Placeholder } from "@/components/ui/Placeholder";
import { getProject, plannerTypeForProject, projects } from "@/content/projects";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return createMetadata({
    title: `${project.title} — sample content`,
    description: project.shortDescription,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <ViewTracker event="project_viewed" payload={{ slug: project.slug, project_type: project.projectType }} />
      <Breadcrumbs items={[{ href: "/projects", label: "Projects" }, { href: `/projects/${project.slug}`, label: project.title }]} />
      <div className="relative min-h-[50vh] bg-forest-deep">
        <HeroImage src={project.heroImage} alt={`${project.title}. Sample photograph, not an SPL Homes project.`} priority />
        <div className="absolute inset-0 bg-ink/45" />
        <Container className="relative flex min-h-[50vh] flex-col justify-end py-12 text-cream">
          <p className="text-xs uppercase tracking-[0.18em] text-timber">
            {project.typeLabel} · Sample content
          </p>
          <h1 className="font-display mt-3 text-5xl">{project.title}</h1>
          <p className="mt-3 text-cream/80">
            {project.location}
            {project.completionYear ? ` · ${project.completionYear}` : ""}
            {project.floorArea ? ` · ${project.floorArea}` : ""}
          </p>
        </Container>
      </div>
      <Container className="grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <Placeholder>
            SAMPLE CONTENT. Photography and project facts must be replaced with a real SPL Homes job
            before this page is treated as a portfolio piece.
          </Placeholder>
          {[
            ["Client brief", project.clientBrief],
            ["Challenge", project.challenge],
            ["Solution", project.solution],
            ["Outcome", project.outcome],
          ]
            .filter(([, value]) => value)
            .map(([title, value]) => (
              <section key={title}>
                <h2 className="font-display text-3xl">{title}</h2>
                <p className="mt-3 text-lg leading-8 text-ink-soft">{value}</p>
              </section>
            ))}
          {project.gallery.length ? <Gallery images={project.gallery} /> : null}
        </div>
        <aside className="bg-cream p-6">
          <h2 className="font-display text-2xl">Start a similar project</h2>
          <p className="mt-3 text-ink-soft">
            Use the planner and we will pick this up as a {project.typeLabel.toLowerCase()} enquiry.
          </p>
          <dl className="mt-6 space-y-2 text-sm text-ink-soft">
            {project.bedrooms ? (
              <div className="flex justify-between gap-4">
                <dt>Bedrooms</dt>
                <dd>{project.bedrooms}</dd>
              </div>
            ) : null}
            {project.bathrooms ? (
              <div className="flex justify-between gap-4">
                <dt>Bathrooms</dt>
                <dd>{project.bathrooms}</dd>
              </div>
            ) : null}
          </dl>
        </aside>
      </Container>
      <CtaBand
        primary={{
          href: `/start-your-project?type=${plannerTypeForProject(project)}`,
          label: "Start a similar project",
        }}
      />
    </>
  );
}
