import { BeforeAfterSlider } from "@/components/media/BeforeAfterSlider";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Section } from "@/components/ui/Section";

export function RenovationSlider() {
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>Renovations</Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl">Transform the Home You Already Love.</h2>
          <p className="mt-5 text-ink-soft">
            Keep the street, the garden and the bones that work. Change the rooms that do not. The
            images here are placeholders until a real SPL Homes before-and-after is published.
          </p>
          <div className="mt-8">
            <Button href="/start-your-project?type=renovation">Plan my renovation</Button>
          </div>
        </div>
        <BeforeAfterSlider
          beforeSrc="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80"
          afterSrc="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80"
          beforeAlt="Placeholder before image. Not an SPL Homes project."
          afterAlt="Placeholder after image. Not an SPL Homes project."
        />
      </div>
    </Section>
  );
}
