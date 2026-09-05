import { telHref } from "@/content/site";
import { CtaBand } from "@/components/ui/CtaBand";

export function FinalCta() {
  return (
    <CtaBand
      title="Have a project in mind?"
      text="Tell us what you are planning and we will help you understand the next step."
      primary={{ href: "/start-your-project", label: "Start your project" }}
      secondary={{ href: telHref(), label: "Call SPL Homes" }}
    />
  );
}
