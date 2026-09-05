import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy policy",
  description: "How SPL Homes handles enquiry information collected through this website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        lede="Draft for legal review. This describes how enquiry forms on this website are intended to work."
      />
      <Container className="max-w-3xl space-y-5 py-16 text-ink-soft">
        <p>
          SPL Homes collects the information you submit through the project planner, contact form
          and planning-guide form: name, email, phone, project details, and any message you include.
        </p>
        <p>
          We use that information to respond to your enquiry. We do not sell it. We do not add you
          to a promotional mailing list from these forms.
        </p>
        <p>
          Marketing attribution (such as UTM parameters) may be stored with an enquiry so we can
          understand how you found us. Analytics tools are not loaded until tracking IDs are
          configured.
        </p>
        <p>
          Leads are stored so the business can follow them up. Access is limited to administrators.
          Retention, hosting location and a full Privacy Act 2020 statement should be completed by
          SPL Homes’ adviser before launch.
        </p>
        <p>Contact details for privacy requests will be published here when they are supplied.</p>
      </Container>
    </>
  );
}
