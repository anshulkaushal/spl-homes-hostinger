import { Suspense } from "react";
import { ProjectPlanner } from "@/components/planner/ProjectPlanner";
import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Start your project",
  description: "Tell SPL Homes what you are planning. A short planner for new homes, renovations and developments in Wellington.",
  path: "/start-your-project",
});

export default function StartProjectPage() {
  return (
    <div className="bg-paper-2 py-12 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-timber">Project planner</p>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl">Start your project</h1>
          <p className="mt-4 text-lg text-ink-soft">
            Eight short steps, then a review before you send. You will get an enquiry reference and
            we will follow up. This is not a quote and it is not a contract.
          </p>
        </div>
        <Suspense fallback={<div className="bg-cream p-10">Loading planner…</div>}>
          <ProjectPlanner />
        </Suspense>
      </Container>
    </div>
  );
}
