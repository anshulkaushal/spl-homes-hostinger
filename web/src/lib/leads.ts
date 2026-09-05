import { randomBytes } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getPrisma, mysqlEnabled } from "./db";
import { createReference } from "./reference";

export const leadStatuses = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONSULTATION_BOOKED",
  "PROPOSAL",
  "WON",
  "LOST",
  "ARCHIVED",
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export type Lead = {
  id: string;
  reference: string;
  created_at: string;
  updated_at?: string;
  name: string;
  email: string;
  phone?: string;
  preferred_contact?: string;
  project_type: string;
  location?: string;
  location_suburb?: string;
  location_region?: string;
  street_address?: string;
  project_stage?: string;
  budget_range?: string;
  timeframe?: string;
  project_details?: string;
  description?: string;
  source: string;
  landing_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  status: LeadStatus;
  message?: string;
  consent: boolean;
  consent_at?: string;
  marketing_consent?: boolean;
  marketing_consent_at?: string;
  is_synthetic: boolean;
  idempotency_key?: string;
};

export type LeadWrite = Omit<Lead, "id" | "reference" | "created_at" | "updated_at" | "status">;

function dataFile() {
  return process.env.LEADS_DATA_FILE || path.join(process.cwd(), "data", "leads.json");
}

async function readLeads(): Promise<Lead[]> {
  try {
    const raw = await readFile(/* turbopackIgnore: true */ dataFile(), "utf8");
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}

async function writeLeads(leads: Lead[]) {
  const file = dataFile();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(/* turbopackIgnore: true */ file, JSON.stringify(leads, null, 2), "utf8");
}

type LeadRow = {
  id: string;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  phone: string | null;
  projectType: string;
  location: string | null;
  locationSuburb?: string | null;
  locationRegion?: string | null;
  streetAddress?: string | null;
  projectStage: string | null;
  budgetRange: string | null;
  timeframe: string | null;
  description: string | null;
  projectDetails?: string | null;
  source: string;
  landingPage: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  status: LeadStatus;
  preferredContact: string | null;
  message: string | null;
  consent: boolean;
  consentAt?: Date | null;
  marketingConsent?: boolean;
  marketingConsentAt?: Date | null;
  isSynthetic?: boolean;
  idempotencyKey?: string | null;
};

function fromRow(row: LeadRow): Lead {
  return {
    id: row.id,
    reference: row.reference,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    project_type: row.projectType,
    location: row.location ?? undefined,
    location_suburb: row.locationSuburb ?? undefined,
    location_region: row.locationRegion ?? undefined,
    street_address: row.streetAddress ?? undefined,
    project_stage: row.projectStage ?? undefined,
    budget_range: row.budgetRange ?? undefined,
    timeframe: row.timeframe ?? undefined,
    description: row.description ?? undefined,
    project_details: row.projectDetails ?? row.description ?? undefined,
    source: row.source,
    landing_page: row.landingPage ?? undefined,
    utm_source: row.utmSource ?? undefined,
    utm_medium: row.utmMedium ?? undefined,
    utm_campaign: row.utmCampaign ?? undefined,
    utm_content: row.utmContent ?? undefined,
    utm_term: row.utmTerm ?? undefined,
    gclid: row.gclid ?? undefined,
    fbclid: row.fbclid ?? undefined,
    status: row.status,
    preferred_contact: row.preferredContact ?? undefined,
    message: row.message ?? undefined,
    consent: row.consent,
    consent_at: row.consentAt?.toISOString(),
    marketing_consent: row.marketingConsent ?? false,
    marketing_consent_at: row.marketingConsentAt?.toISOString(),
    is_synthetic: Boolean(row.isSynthetic),
    idempotency_key: row.idempotencyKey ?? undefined,
  };
}

export async function listLeads(options?: { includeSynthetic?: boolean }) {
  const includeSynthetic = options?.includeSynthetic ?? true;
  const prisma = getPrisma();
  if (prisma) {
    const rows = await prisma.lead.findMany({
      where: includeSynthetic ? undefined : { isSynthetic: false },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => fromRow(row as LeadRow));
  }
  const leads = await readLeads();
  return leads
    .filter((lead) => includeSynthetic || !lead.is_synthetic)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function findLeadByIdempotency(key: string) {
  const prisma = getPrisma();
  if (prisma) {
    const row = await prisma.lead.findUnique({ where: { idempotencyKey: key } });
    return row ? fromRow(row as LeadRow) : null;
  }
  const leads = await readLeads();
  return leads.find((lead) => lead.idempotency_key === key) ?? null;
}

export async function saveLead(input: LeadWrite) {
  const reference = createReference();
  const prisma = getPrisma();
  if (prisma) {
    const row = await prisma.lead.create({
      data: {
        reference,
        name: input.name,
        email: input.email,
        phone: input.phone,
        projectType: input.project_type,
        location: input.location,
        locationSuburb: input.location_suburb,
        locationRegion: input.location_region,
        streetAddress: input.street_address,
        projectStage: input.project_stage,
        budgetRange: input.budget_range,
        timeframe: input.timeframe,
        description: input.description,
        projectDetails: input.project_details,
        source: input.source,
        landingPage: input.landing_page,
        utmSource: input.utm_source,
        utmMedium: input.utm_medium,
        utmCampaign: input.utm_campaign,
        utmContent: input.utm_content,
        utmTerm: input.utm_term,
        gclid: input.gclid,
        fbclid: input.fbclid,
        preferredContact: input.preferred_contact,
        message: input.message,
        consent: input.consent,
        consentAt: input.consent_at ? new Date(input.consent_at) : new Date(),
        marketingConsent: input.marketing_consent ?? false,
        marketingConsentAt: input.marketing_consent_at ? new Date(input.marketing_consent_at) : undefined,
        isSynthetic: input.is_synthetic,
        idempotencyKey: input.idempotency_key,
      },
    });
    return fromRow(row as LeadRow);
  }

  const now = new Date().toISOString();
  const leads = await readLeads();
  const lead: Lead = {
    ...input,
    id: randomBytes(8).toString("hex"),
    reference,
    created_at: now,
    updated_at: now,
    status: "NEW",
    is_synthetic: Boolean(input.is_synthetic),
  };
  leads.push(lead);
  await writeLeads(leads);
  return lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const prisma = getPrisma();
  if (prisma) {
    const row = await prisma.lead.update({ where: { id }, data: { status } });
    return fromRow(row as LeadRow);
  }
  const leads = await readLeads();
  const index = leads.findIndex((lead) => lead.id === id);
  if (index === -1) return null;
  leads[index] = { ...leads[index], status, updated_at: new Date().toISOString() };
  await writeLeads(leads);
  return leads[index];
}

export function persistenceMode() {
  return mysqlEnabled() ? "mysql" : "file";
}
