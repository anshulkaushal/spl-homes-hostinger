import { faqs } from "@/content/faqs";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "FAQ",
  description: "Common questions about working with SPL Homes on a Wellington building project.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <PageHero
        eyebrow="FAQ"
        title="Straight answers."
        lede="If your question is about price or programme, the honest answer is usually: it depends on the site. The planner is still the fastest next step."
        primary={{ href: "/start-your-project", label: "Start your project" }}
      />
      <Container className="max-w-3xl py-16">
        <dl className="space-y-8">
          {faqs.map((item) => (
            <div key={item.q}>
              <dt className="font-display text-2xl">{item.q}</dt>
              <dd className="mt-3 text-ink-soft">{item.a}</dd>
            </div>
          ))}
        </dl>
      </Container>
      <CtaBand />
    </>
  );
}
