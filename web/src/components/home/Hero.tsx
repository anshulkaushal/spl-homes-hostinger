import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroImage } from "@/components/media/HeroImage";

export function Hero() {
  return (
    <section className="relative min-h-[88svh] overflow-hidden bg-forest-deep text-cream">
      <HeroImage
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
        alt="Placeholder architectural photograph of a contemporary house. Replace with SPL Homes project imagery."
        priority
      />
      <div className="absolute inset-0 bg-ink/55" />
      <Container className="relative flex min-h-[88svh] flex-col justify-end pb-16 pt-28 sm:justify-center sm:pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cream/70">
          Wellington region builders
        </p>
        <h1 className="font-display mt-4 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">
          Build Better.
          <br />
          Live Better.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-cream/85">
          New homes, renovations and building projects across Wellington. From the first
          conversation through to final handover, SPL Homes helps clients plan and deliver
          well-built spaces with clear communication and personal service.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/start-your-project">Start your project</Button>
          <Button href="/projects" variant="secondary">
            View our projects
          </Button>
        </div>
        <a href="/contact" className="mt-5 text-sm text-cream/70 underline-offset-4 hover:underline">
          Talk to SPL Homes
        </a>
      </Container>
    </section>
  );
}
