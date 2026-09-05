import Link from "next/link";
import { articles } from "@/content/insights";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Section } from "@/components/ui/Section";

export function HomeInsights() {
  return (
    <Section>
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Insights</Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl">Straight answers before you build.</h2>
        </div>
        <Button href="/insights" variant="outline">
          All insights
        </Button>
      </div>
      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <li key={article.slug} className="card p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-timber">{article.category}</p>
            <h3 className="font-display mt-3 text-2xl">
              <Link href={`/insights/${article.slug}`} className="hover:text-forest">
                {article.title}
              </Link>
            </h3>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{article.excerpt}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
