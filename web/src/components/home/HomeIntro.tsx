import { Eyebrow, Section } from "@/components/ui/Section";

export function HomeIntro() {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <Eyebrow>SPL Homes</Eyebrow>
          <h2 className="font-display max-w-xl text-4xl sm:text-5xl">
            A Wellington builder for the project you actually need.
          </h2>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-ink-soft">
          New homes, renovations, extensions and related building work across the Wellington
          region. The work is professional. The contact is personal. You get a clear next step
          instead of a brochure and a waiting list.
        </p>
      </div>
    </Section>
  );
}
