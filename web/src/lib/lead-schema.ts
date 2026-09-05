import { z } from "zod";
import { isPlannerProjectType, normalizeProjectType } from "./planner";

export const projectTypeSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .transform((value) => normalizeProjectType(value) || value)
  .refine((value) => isPlannerProjectType(value), "Unknown project type");

export const leadSchema = z.object({
  source: z.enum(["planner", "contact", "guide"]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional(),
  project_type: projectTypeSchema,
  location: z.string().trim().max(200).optional(),
  location_suburb: z.string().trim().max(120).optional(),
  location_region: z.string().trim().max(120).optional(),
  street_address: z.string().trim().max(200).optional(),
  project_stage: z.string().trim().max(80).optional(),
  budget_range: z.string().trim().max(80).optional(),
  timeframe: z.string().trim().max(80).optional(),
  project_details: z.string().trim().max(4000).optional(),
  description: z.string().trim().max(4000).optional(),
  preferred_contact_method: z.string().trim().max(40).optional(),
  preferred_contact: z.string().trim().max(40).optional(),
  message: z.string().trim().max(2000).optional(),
  consent: z.literal(true),
  marketing_consent: z.boolean().optional(),
  company: z.string().max(80).optional(),
  landing_page: z.string().max(300).optional(),
  utm_source: z.string().max(120).optional(),
  utm_medium: z.string().max(120).optional(),
  utm_campaign: z.string().max(120).optional(),
  utm_content: z.string().max(120).optional(),
  utm_term: z.string().max(120).optional(),
  gclid: z.string().max(200).optional(),
  fbclid: z.string().max(200).optional(),
  idempotency_key: z.string().uuid().optional(),
  isSynthetic: z.unknown().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export function publicLeadFields(input: LeadInput) {
  const data = { ...input };
  delete data.company;
  delete data.isSynthetic;
  return data;
}
