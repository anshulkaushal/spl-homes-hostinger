import Link from "next/link";
import { intents } from "@/content/intents";
import { ProjectImage } from "@/components/media/ProjectImage";
import { Eyebrow, Section } from "@/components/ui/Section";

export function IntentSelector() {
  return (
    <Section id="planning">
      <Eyebrow>Start here</Eyebrow>
      <h2 className="font-display max-w-2xl text-4xl sm:text-5xl">What are you planning?</h2>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Choose the path that matches your project. Every card can take you into the relevant service,
        or straight into the project planner.
      </p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {intents.map((intent) => (
          <article key={intent.id} className="card group overflow-hidden">
            <div className="relative aspect-[16/10]">
              <ProjectImage src={intent.image} alt={intent.alt} sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className="flex flex-col gap-3 p-5">
              <h3 className="font-display text-2xl">{intent.title}</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link href={intent.href} className="font-medium text-forest underline-offset-4 hover:underline">
                  Learn more
                </Link>
                <Link
                  href={`/start-your-project?type=${intent.plannerValue}`}
                  className="font-semibold text-ink"
                >
                  Start a project
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
