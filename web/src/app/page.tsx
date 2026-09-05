import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { HomeInsights } from "@/components/home/HomeInsights";
import { HomeIntro } from "@/components/home/HomeIntro";
import { HomeServices } from "@/components/home/HomeServices";
import { IntentSelector } from "@/components/home/IntentSelector";
import { LeadMagnet } from "@/components/home/LeadMagnet";
import { ProcessPreview } from "@/components/home/ProcessPreview";
import { RenovationSlider } from "@/components/home/RenovationSlider";
import { ServiceAreas } from "@/components/home/ServiceAreas";
import { Trust } from "@/components/home/Trust";
import { WhySpl } from "@/components/home/WhySpl";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "SPL Homes | Build Better. Live Better.",
  description:
    "Wellington builders for new homes, renovations, extensions and property development. Start your project with SPL Homes.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <IntentSelector />
      <HomeIntro />
      <HomeServices />
      <FeaturedProjects />
      <WhySpl />
      <ProcessPreview />
      <RenovationSlider />
      <ServiceAreas />
      <Trust />
      <LeadMagnet />
      <HomeInsights />
      <FinalCta />
    </>
  );
}
