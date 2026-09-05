import { emailLabel, mailHref, phoneLabel, site, telHref } from "@/content/site";
import { QuickEnquiry } from "@/components/forms/QuickEnquiry";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Talk to SPL Homes",
  description: "Start a project, send a quick enquiry, or call SPL Homes about a Wellington build or renovation.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk about your build."
        lede="The project planner is the best start if you have a real job in mind. Use the short form if you just want a conversation."
        primary={{ href: "/start-your-project", label: "Start your project" }}
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl">Reach us</h2>
          <ul className="mt-6 space-y-3 text-lg">
            <li>
              <a href={telHref()} className="hover:text-forest">
                {phoneLabel()}
              </a>
            </li>
            <li>
              <a href={mailHref()} className="hover:text-forest">
                {emailLabel()}
              </a>
            </li>
            <li className="text-ink-soft">{site.address || "Address to be added"}</li>
            <li className="text-ink-soft">{site.hours}</li>
            <li>
              <a href={site.instagram} className="hover:text-forest">
                Instagram
              </a>
            </li>
          </ul>
          <p className="mt-8 max-w-md text-ink-soft">
            Phone and email are placeholders until SPL Homes supplies the live details. Enquiries
            submitted here are stored for follow-up.
          </p>
        </div>
        <QuickEnquiry />
      </Container>
    </>
  );
}
