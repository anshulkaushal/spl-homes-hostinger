import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

export function Section({
  id,
  children,
  className,
  contained = true,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  contained?: boolean;
}) {
  const inner = contained ? <Container>{children}</Container> : children;
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      {inner}
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-timber">{children}</p>
  );
}
