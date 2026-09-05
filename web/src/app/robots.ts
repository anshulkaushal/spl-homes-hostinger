import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { shouldNoindex } from "@/lib/env-flags";
import { robotsRules } from "@/lib/seo-routes";

export default function robots(): MetadataRoute.Robots {
  const staging = shouldNoindex();
  return {
    rules: robotsRules(staging),
    ...(staging ? {} : { sitemap: `${site.url.replace(/\/$/, "")}/sitemap.xml` }),
  };
}
