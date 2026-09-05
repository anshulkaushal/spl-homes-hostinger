import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-timber">404</p>
      <h1 className="font-display mt-3 text-5xl">This page is not here.</h1>
      <p className="mt-4 max-w-lg text-ink-soft">
        The link may be old, or the page has not been published yet. Start a project if you came
        looking for a builder.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/start-your-project">Start your project</Button>
        <Button href="/" variant="outline">
          Back to home
        </Button>
      </div>
    </Container>
  );
}
