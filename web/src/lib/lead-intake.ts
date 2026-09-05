import { leadSchema, publicLeadFields } from "./lead-schema";
import { findLeadByIdempotency, saveLead, type Lead } from "./leads";

const recent = new Map<string, number>();

export function rateLimited(ip: string, windowMs = 8000) {
  const now = Date.now();
  const last = recent.get(ip) ?? 0;
  if (now - last < windowMs) return true;
  recent.set(ip, now);
  return false;
}

export function resetRateLimit() {
  recent.clear();
}

export function isSyntheticRequest(request: Request, env = process.env) {
  const marker = env.CI_LEAD_MARKER;
  if (!marker) return false;
  return request.headers.get("x-ci-lead-marker") === marker;
}

export function requestIdempotencyKey(request: Request, body: { idempotency_key?: string }) {
  return request.headers.get("idempotency-key") ?? body.idempotency_key;
}

export type LeadIntakeResult =
  | { ok: true; lead: Lead; duplicate: boolean; ignored?: false }
  | { ok: true; ignored: true; reference: "SPL-IGNORED" }
  | { ok: false; status: number; error: string };

export async function intakeLead(request: Request, body: unknown): Promise<LeadIntakeResult> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const synthetic = isSyntheticRequest(request);

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "Please check the form and try again." };
  }

  if (parsed.data.company) {
    return { ok: true, ignored: true, reference: "SPL-IGNORED" };
  }

  const data = publicLeadFields(parsed.data);
  const idempotencyKey = requestIdempotencyKey(request, data);
  if (idempotencyKey) {
    const existing = await findLeadByIdempotency(idempotencyKey);
    if (existing) return { ok: true, lead: existing, duplicate: true };
  }

  if (!synthetic && rateLimited(ip)) {
    return { ok: false, status: 429, error: "Please wait a moment and try again." };
  }

  const now = new Date().toISOString();
  const lead = await saveLead({
    name: data.name,
    email: data.email,
    phone: data.phone,
    project_type: data.project_type,
    location: data.location ?? [data.location_suburb, data.location_region].filter(Boolean).join(", "),
    location_suburb: data.location_suburb,
    location_region: data.location_region,
    street_address: data.street_address,
    project_stage: data.project_stage,
    budget_range: data.budget_range,
    timeframe: data.timeframe,
    project_details: data.project_details ?? data.description,
    description: data.project_details ?? data.description,
    preferred_contact: data.preferred_contact_method ?? data.preferred_contact,
    message: data.message,
    source: data.source,
    landing_page: data.landing_page,
    utm_source: data.utm_source,
    utm_medium: data.utm_medium,
    utm_campaign: data.utm_campaign,
    utm_content: data.utm_content,
    utm_term: data.utm_term,
    gclid: data.gclid,
    fbclid: data.fbclid,
    consent: true,
    consent_at: now,
    marketing_consent: Boolean(data.marketing_consent),
    marketing_consent_at: data.marketing_consent ? now : undefined,
    is_synthetic: synthetic,
    idempotency_key: idempotencyKey,
  });

  return { ok: true, lead, duplicate: false };
}
