export const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export const clickIds = ["gclid", "fbclid"] as const;

export type UtmSet = Partial<Record<(typeof utmKeys)[number], string>> & {
  gclid?: string;
  fbclid?: string;
};

export type AttributionTouch = UtmSet & { landing_page?: string };

const STORAGE_KEY = "spl_attribution";

export type Attribution = {
  first: AttributionTouch;
  last: AttributionTouch;
};

export function parseAttributionParams(
  search: string,
  pathname = "/",
): AttributionTouch {
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  const incoming: AttributionTouch = {
    landing_page: pathname + (search.startsWith("?") ? search : search ? `?${search}` : ""),
  };
  for (const key of utmKeys) {
    const value = params.get(key);
    if (value) incoming[key] = value;
  }
  for (const key of clickIds) {
    const value = params.get(key);
    if (value) incoming[key] = value;
  }
  return incoming;
}

export function mergeAttribution(existing: Attribution | null, incoming: AttributionTouch): Attribution {
  if (!existing) return { first: incoming, last: incoming };
  return { first: existing.first, last: { ...existing.last, ...incoming } };
}

export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

export function captureAttribution() {
  if (typeof window === "undefined") return;
  const incoming = parseAttributionParams(window.location.search, window.location.pathname);
  const next = mergeAttribution(readAttribution(), incoming);
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function attributionForLead() {
  const attribution = readAttribution();
  if (!attribution) return {};
  return {
    landing_page: attribution.last.landing_page ?? attribution.first.landing_page,
    utm_source: attribution.first.utm_source,
    utm_medium: attribution.first.utm_medium,
    utm_campaign: attribution.first.utm_campaign,
    utm_content: attribution.first.utm_content,
    utm_term: attribution.first.utm_term,
    gclid: attribution.first.gclid ?? attribution.last.gclid,
    fbclid: attribution.first.fbclid ?? attribution.last.fbclid,
  };
}
