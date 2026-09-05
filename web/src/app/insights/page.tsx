import Link from "next/link";
import { articles } from "@/content/insights";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Building advice and insights",
  description: "Practical writing on Wellington building, renovations, consent and choosing a builder — without invented prices.",
  path: "/insights",
});

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Advice you can use before you call."
        lede="Long-form notes on building in Wellington. We do not invent current prices or council timeframes."
        primary={{ href: "/start-your-project", label: "Start your project" }}
      />
      <Container className="grid gap-6 py-16 md:grid-cols-2">
        {articles.map((article) => (
          <article key={article.slug} className="border border-stone bg-cream p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-timber">{article.category}</p>
            <h2 className="font-display mt-3 text-2xl">
              <Link href={`/insights/${article.slug}`}>{article.title}</Link>
            </h2>
            <p className="mt-3 text-ink-soft">{article.excerpt}</p>
          </article>
        ))}
      </Container>
      <CtaBand />
    </>
  );
}
