import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";

export function PageHero({
  eyebrow,
  title,
  lede,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <header className="border-b border-stone bg-forest-deep text-cream">
      <Container className="py-16 sm:py-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="font-display max-w-4xl text-4xl leading-[1.1] sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-cream/80">{lede}</p>
        {(primary || secondary) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {primary ? <Button href={primary.href}>{primary.label}</Button> : null}
            {secondary ? (
              <Button href={secondary.href} variant="secondary">
                {secondary.label}
              </Button>
            ) : null}
          </div>
        )}
      </Container>
    </header>
  );
}
