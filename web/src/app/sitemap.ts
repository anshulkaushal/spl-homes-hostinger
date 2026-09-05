import type { MetadataRoute } from "next";
import { articles } from "@/content/insights";
import { locations } from "@/content/locations";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { shouldNoindex } from "@/lib/env-flags";
import { coreSitemapPaths } from "@/lib/seo-routes";
import { isPublicProductionUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  if (shouldNoindex() && isPublicProductionUrl(base)) {
    return [];
  }
  const staticPaths = coreSitemapPaths;

  return [
    ...staticPaths.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const })),
    ...services.map((service) => ({ url: `${base}/services/${service.slug}`, changeFrequency: "monthly" as const })),
    ...projects.map((project) => ({ url: `${base}/projects/${project.slug}`, changeFrequency: "monthly" as const })),
    ...articles.map((article) => ({ url: `${base}/insights/${article.slug}`, changeFrequency: "monthly" as const })),
    ...locations.map((location) => ({ url: `${base}/builders/${location.slug}`, changeFrequency: "monthly" as const })),
  ];
}
