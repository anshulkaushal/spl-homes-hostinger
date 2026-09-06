export function robotsRules(noindex: boolean) {
  if (noindex) {
    return { userAgent: "*", disallow: "/" as const };
  }
  return {
    userAgent: "*",
    allow: "/",
    disallow: ["/admin", "/api"],
  };
}

export function robotsTxtBody(noindex: boolean, siteUrl: string) {
  const rules = robotsRules(noindex);
  const lines = [`User-Agent: ${rules.userAgent}`];
  if ("allow" in rules && rules.allow) {
    for (const allow of Array.isArray(rules.allow) ? rules.allow : [rules.allow]) {
      lines.push(`Allow: ${allow}`);
    }
  }
  for (const disallow of Array.isArray(rules.disallow) ? rules.disallow : [rules.disallow]) {
    lines.push(`Disallow: ${disallow}`);
  }
  if (!noindex) {
    lines.push("", `Sitemap: ${siteUrl.replace(/\/$/, "")}/sitemap.xml`);
  }
  return `${lines.join("\n")}\n`;
}

export const coreSitemapPaths = [
  "/",
  "/services",
  "/projects",
  "/process",
  "/about",
  "/where-we-build",
  "/start-your-project",
  "/insights",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
] as const;
