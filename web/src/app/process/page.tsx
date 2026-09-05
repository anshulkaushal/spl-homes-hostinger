import { processPage } from "@/content/process";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/ui/PageHero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Our process",
  description: "How SPL Homes takes a Wellington building project from first conversation to handover.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Our process"
        title="A clear path. No theatre."
        lede="Every project is different. The sequence is not. You should always know what just happened and what happens next."
        primary={{ href: "/start-your-project", label: "Start your project" }}
      />
      <Container className="py-16">
        <ol className="space-y-10">
          {processPage.map((stage, index) => (
            <li key={stage.title} className="grid gap-6 border-t border-stone pt-10 lg:grid-cols-[0.3fr_1fr]">
              <p className="font-display text-4xl text-timber">{String(index + 1).padStart(2, "0")}</p>
              <div>
                <h2 className="font-display text-3xl">{stage.title}</h2>
                <p className="mt-3 max-w-2xl text-lg leading-8 text-ink-soft">{stage.body}</p>
                <div className="mt-6">
                  <Button href="/start-your-project" variant="outline">
                    Start your project
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>
      <CtaBand />
    </>
  );
}
