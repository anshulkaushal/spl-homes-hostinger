import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Website terms",
  description: "Terms of use for the SPL Homes website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Website terms"
        lede="Draft for legal review. Using this website does not create a building contract."
      />
      <Container className="max-w-3xl space-y-5 py-16 text-ink-soft">
        <p>
          Content on this website is general information about SPL Homes and residential building in
          the Wellington region. It is not a quote, specification, or legal, planning or engineering
          advice.
        </p>
        <p>
          Placeholder photography, empty testimonials and unpublished project cards are marked as
          such. They are not representations of completed SPL Homes work.
        </p>
        <p>
          Submitting an enquiry is a request for contact. It does not reserve a start date or create
          a contract. Any building agreement will be a separate document.
        </p>
        <p>
          Budget bands in the planner are for qualification only. They are not SPL Homes prices.
        </p>
        <p>These terms should be reviewed by SPL Homes’ adviser before the site is advertised.</p>
      </Container>
    </>
  );
}
