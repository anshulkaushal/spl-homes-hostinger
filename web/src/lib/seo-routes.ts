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
