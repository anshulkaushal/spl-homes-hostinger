import Link from "next/link";
import { ProjectImage } from "@/components/media/ProjectImage";
import type { Service } from "@/content/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card group overflow-hidden">
      <div className="relative aspect-[16/10]">
        <ProjectImage
          src={service.image}
          alt={`Placeholder photograph for ${service.title}. Replace with SPL Homes imagery.`}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-2xl">{service.title}</h3>
        <p className="text-sm leading-6 text-ink-soft">{service.summary}</p>
        <div className="mt-auto flex flex-wrap gap-4 pt-2 text-sm">
          <Link href={`/services/${service.slug}`} className="font-medium text-forest underline-offset-4 hover:underline">
            Learn more
          </Link>
          <Link href={service.cta.href} className="font-semibold text-ink">
            Start a project
          </Link>
        </div>
      </div>
    </article>
  );
}
