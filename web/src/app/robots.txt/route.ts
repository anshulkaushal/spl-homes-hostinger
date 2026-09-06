import { site } from "@/content/site";
import { shouldNoindex } from "@/lib/env-flags";
import { xRobotsTagHeader } from "@/lib/robots-tag";
import { robotsTxtBody } from "@/lib/seo-routes";

export function GET() {
  const noindex = shouldNoindex();
  const headers = new Headers({ "Content-Type": "text/plain" });
  const robotsTag = xRobotsTagHeader(noindex);
  if (robotsTag) {
    headers.set(robotsTag.key, robotsTag.value);
  }

  return new Response(robotsTxtBody(noindex, site.url), {
    status: 200,
    headers,
  });
}
