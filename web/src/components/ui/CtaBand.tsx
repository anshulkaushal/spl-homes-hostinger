import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CtaBand({
  title = "Have a project in mind?",
  text = "Tell us what you are planning and we will help you understand the next step.",
  primary = { href: "/start-your-project", label: "Start your project" },
  secondary,
}: {
  title?: string;
  text?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="bg-forest text-cream">
      <Container className="flex flex-col items-start justify-between gap-8 py-16 sm:flex-row sm:items-center">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-3 text-cream/75">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={primary.href} variant="timber">
            {primary.label}
          </Button>
          {secondary ? (
            <Button href={secondary.href} variant="secondary">
              {secondary.label}
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
