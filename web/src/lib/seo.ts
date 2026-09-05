import type { Metadata } from "next";
import { site } from "@/content/site";
import { shouldNoindex } from "@/lib/env-flags";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  index?: boolean;
};

export function absoluteUrl(path = "/") {
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createMetadata({ title, description, path = "/", index = true }: SeoInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes("SPL Homes") ? title : `${title} | SPL Homes`;
  const noindex = shouldNoindex() || !index;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
