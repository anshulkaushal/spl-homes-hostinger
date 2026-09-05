import { whyPoints } from "@/content/why";
import { Eyebrow, Section } from "@/components/ui/Section";

export function WhySpl() {
  return (
    <Section className="bg-cream">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Eyebrow>Why SPL Homes</Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl">Professional building expertise with personal service.</h2>
          <p className="mt-5 text-ink-soft">
            We are not a franchise volume builder, and we are not a luxury brand selling a lifestyle.
            We are a Wellington building company that wants the work to be clear, well made, and
            human to deal with.
          </p>
        </div>
        <ul className="grid gap-px bg-stone sm:grid-cols-2">
          {whyPoints.map((point) => (
            <li key={point.title} className="bg-cream p-6">
              <h3 className="font-display text-xl">{point.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
