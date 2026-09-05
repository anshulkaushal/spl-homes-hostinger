"use client";

import Link from "next/link";
import { useState } from "react";
import { ProjectImage } from "@/components/media/ProjectImage";
import { featuredProjects, projectTypes, projects } from "@/content/projects";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

export function FeaturedProjects({ all = false }: { all?: boolean }) {
  const [filter, setFilter] = useState("all");
  const source = all ? projects : featuredProjects();
  const visible = source.filter((project) => filter === "all" || project.projectType === filter);

  return (
    <Section className="bg-paper">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Work</Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl">{all ? "Project gallery" : "Featured projects"}</h2>
          <p className="mt-3 max-w-xl text-ink-soft">
            Cards below are labelled SAMPLE CONTENT. They are not completed SPL Homes projects.
          </p>
        </div>
        {!all ? (
          <Button href="/projects" variant="outline">
            View all projects
          </Button>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Project type">
        {projectTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            role="tab"
            aria-selected={filter === type.id}
            onClick={() => setFilter(type.id)}
            className={cn(
              "min-h-10 border px-4 text-sm",
              filter === type.id ? "border-forest bg-forest text-cream" : "border-stone bg-cream",
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {visible.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="card group overflow-hidden"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <ProjectImage src={project.heroImage} alt={project.gallery[0]?.alt ?? project.title} />
              <span className="absolute left-4 top-4 bg-paper px-2 py-1 text-xs font-semibold uppercase tracking-wide">
                Sample content
              </span>
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-timber">{project.typeLabel}</p>
              <h3 className="font-display mt-2 text-2xl">{project.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">
                {project.location}
                {project.completionYear ? ` · ${project.completionYear}` : ""}
              </p>
              <p className="mt-3 text-sm text-ink-soft">{project.shortDescription}</p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
