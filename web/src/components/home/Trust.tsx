import { Placeholder } from "@/components/ui/Placeholder";
import { Eyebrow, Section } from "@/components/ui/Section";

const slots = [
  "Client testimonials — add real quotes only",
  "Google reviews — connect when a profile is supplied",
  "Builder memberships — add certificates you actually hold",
  "Industry certifications — do not invent these",
  "Partner logos — supply artwork",
  "Warranty information — publish the real documents",
  "Project statistics — only after they are factual",
];

export function Trust() {
  return (
    <Section>
      <Eyebrow>Trust</Eyebrow>
      <h2 className="font-display max-w-2xl text-4xl sm:text-5xl">Proof belongs here — when it is real.</h2>
      <p className="mt-4 max-w-2xl text-ink-soft">
        This section is empty on purpose. We will not invent reviews, awards, ratings or years in
        business. When you have the material, it goes here.
      </p>
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {slots.map((slot) => (
          <Placeholder key={slot}>{slot}</Placeholder>
        ))}
      </div>
    </Section>
  );
}
