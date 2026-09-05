export function resolveSiteUrl(env = process.env) {
  const explicit = env.SITE_URL || env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (env.APP_ENV === "staging") return "https://staging.splhomes.co.nz";
  if (env.NOINDEX === "true" || env.APP_ENV === "local") return "http://localhost:3000";
  return "https://splhomes.co.nz";
}

export function isPublicProductionUrl(url: string) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "splhomes.co.nz" || host === "www.splhomes.co.nz";
  } catch {
    return false;
  }
}
