import { notFound } from "next/navigation";
import { articles, getArticle } from "@/content/insights";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return createMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/insights/${article.slug}`,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          author: { "@type": "Organization", name: "SPL Homes" },
        }}
      />
      <Container className="py-16">
        <p className="text-xs uppercase tracking-[0.16em] text-timber">{article.category}</p>
        <h1 className="font-display mt-3 max-w-4xl text-4xl sm:text-6xl">{article.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">{article.excerpt}</p>
        <div className="mt-10 max-w-2xl space-y-5 text-lg leading-8 text-ink-soft">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Container>
      <CtaBand />
    </>
  );
}
