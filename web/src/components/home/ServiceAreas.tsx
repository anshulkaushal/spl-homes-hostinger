import Link from "next/link";
import { coverageAreas } from "@/content/locations";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Section } from "@/components/ui/Section";

export function ServiceAreas() {
  return (
    <Section className="bg-cream">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Eyebrow>Wellington region</Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl">Where we build</h2>
          <p className="mt-5 max-w-xl text-ink-soft">
            These places are listed because they are the market we are designing for. They are not
            confirmed coverage until SPL Homes marks them as such. If your suburb is missing, still
            ask.
          </p>
          <div className="mt-8">
            <Button href="/where-we-build" variant="outline">
              Check your area
            </Button>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-px bg-stone sm:grid-cols-3">
          {coverageAreas.map((area) => (
            <li key={area.name} className="bg-cream">
              {area.slug ? (
                <Link href={`/builders/${area.slug}`} className="block p-4 hover:bg-paper">
                  <span className="block font-medium">{area.name}</span>
                  <span className="text-xs text-ink-soft">Coverage to confirm</span>
                </Link>
              ) : (
                <div className="p-4">
                  <span className="block font-medium">{area.name}</span>
                  <span className="text-xs text-ink-soft">Listed · not a page yet</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
