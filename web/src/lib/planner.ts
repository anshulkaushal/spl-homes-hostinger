export const plannerProjectTypes = [
  { id: "new_home", label: "Build a new home" },
  { id: "renovation", label: "Renovate my home" },
  { id: "extension", label: "Extend my home" },
  { id: "knockdown_rebuild", label: "Knock down & rebuild" },
  { id: "development", label: "Develop my property" },
  { id: "commercial", label: "Commercial project" },
  { id: "unsure", label: "I’m not sure yet" },
] as const;

export type PlannerProjectType = (typeof plannerProjectTypes)[number]["id"];

export const plannerSteps = [
  "Project type",
  "Location",
  "Project stage",
  "Project details",
  "Indicative budget",
  "Timeframe",
  "Contact details",
  "Review",
] as const;

export const renovationScope = [
  "Kitchen",
  "Bathroom",
  "Extension",
  "Full renovation",
  "Structural changes",
  "Exterior",
  "Other",
] as const;

export type PlannerDraft = {
  project_type: string;
  suburb: string;
  city: string;
  address: string;
  project_stage: string;
  owns_land: string;
  floor_area: string;
  bedrooms: string;
  bathrooms: string;
  storeys: string;
  garage: string;
  has_plans: string;
  reno_scope: string[];
  units: string;
  occupied: string;
  notes: string;
  budget_range: string;
  timeframe: string;
};

export type PlannerContact = {
  name: string;
  email: string;
  phone: string;
  preferred_contact: string;
  message: string;
  marketing_consent: boolean;
};

export type PlannerForm = PlannerDraft & PlannerContact;

export const emptyPlannerDraft: PlannerDraft = {
  project_type: "",
  suburb: "",
  city: "Wellington",
  address: "",
  project_stage: "",
  owns_land: "",
  floor_area: "",
  bedrooms: "",
  bathrooms: "",
  storeys: "",
  garage: "",
  has_plans: "",
  reno_scope: [],
  units: "",
  occupied: "",
  notes: "",
  budget_range: "",
  timeframe: "",
};

export const emptyPlannerContact: PlannerContact = {
  name: "",
  email: "",
  phone: "",
  preferred_contact: "either",
  message: "",
  marketing_consent: false,
};

export const emptyPlannerForm: PlannerForm = {
  ...emptyPlannerDraft,
  ...emptyPlannerContact,
};

export const DRAFT_STORAGE_KEY = "spl_planner_draft";
export const IDEMPOTENCY_STORAGE_KEY = "spl_planner_idempotency";

const legacyTypes: Record<string, PlannerProjectType> = {
  "new-home": "new_home",
  "knockdown-rebuild": "knockdown_rebuild",
  "not-sure": "unsure",
  new_home: "new_home",
  renovation: "renovation",
  extension: "extension",
  knockdown_rebuild: "knockdown_rebuild",
  development: "development",
  commercial: "commercial",
  unsure: "unsure",
};

export function normalizeProjectType(value: string | null | undefined): PlannerProjectType | "" {
  if (!value) return "";
  return legacyTypes[value] ?? "";
}

export function isPlannerProjectType(value: string): value is PlannerProjectType {
  return plannerProjectTypes.some((type) => type.id === value);
}

export function plannerTypeLabel(value: string) {
  return plannerProjectTypes.find((type) => type.id === value)?.label ?? value;
}

export type DetailProfile =
  | "new_build"
  | "renovation"
  | "extension"
  | "development"
  | "commercial"
  | "unsure";

export function detailProfileFor(type: string): DetailProfile {
  switch (type) {
    case "new_home":
    case "knockdown_rebuild":
      return "new_build";
    case "renovation":
      return "renovation";
    case "extension":
      return "extension";
    case "development":
      return "development";
    case "commercial":
      return "commercial";
    default:
      return "unsure";
  }
}

export function canAdvance(step: number, form: PlannerForm) {
  if (step === 0) return Boolean(form.project_type);
  if (step === 1) return Boolean(form.suburb && form.city);
  if (step === 2) return Boolean(form.project_stage);
  if (step === 3) return true;
  if (step === 4) return Boolean(form.budget_range);
  if (step === 5) return Boolean(form.timeframe);
  if (step === 6) return Boolean(form.name.trim().length >= 2 && form.email.includes("@") && form.phone.trim());
  return true;
}

export function buildProjectDetails(form: PlannerDraft) {
  const bits = [
    form.address && `Street address: ${form.address}`,
    form.owns_land && `Owns land: ${form.owns_land}`,
    form.floor_area && `Floor area: ${form.floor_area}`,
    form.bedrooms && `Bedrooms: ${form.bedrooms}`,
    form.bathrooms && `Bathrooms: ${form.bathrooms}`,
    form.storeys && `Storeys: ${form.storeys}`,
    form.garage && `Garage: ${form.garage}`,
    form.has_plans && `Existing plans: ${form.has_plans}`,
    form.reno_scope.length ? `Scope: ${form.reno_scope.join(", ")}` : "",
    form.units && `Units / dwellings: ${form.units}`,
    form.occupied && `Occupied during works: ${form.occupied}`,
    form.notes,
  ].filter(Boolean);
  return bits.join("\n");
}

export function toDraft(form: PlannerForm): PlannerDraft {
  return {
    project_type: form.project_type,
    suburb: form.suburb,
    city: form.city,
    address: form.address,
    project_stage: form.project_stage,
    owns_land: form.owns_land,
    floor_area: form.floor_area,
    bedrooms: form.bedrooms,
    bathrooms: form.bathrooms,
    storeys: form.storeys,
    garage: form.garage,
    has_plans: form.has_plans,
    reno_scope: form.reno_scope,
    units: form.units,
    occupied: form.occupied,
    notes: form.notes,
    budget_range: form.budget_range,
    timeframe: form.timeframe,
  };
}

export function readPlannerDraft(): PlannerDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlannerDraft>;
    return {
      ...emptyPlannerDraft,
      ...parsed,
      project_type: normalizeProjectType(parsed.project_type) || parsed.project_type || "",
      reno_scope: Array.isArray(parsed.reno_scope) ? parsed.reno_scope : [],
    };
  } catch {
    return null;
  }
}

export function writePlannerDraft(form: PlannerForm) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(toDraft(form)));
}

export function clearPlannerDraft() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  window.sessionStorage.removeItem(IDEMPOTENCY_STORAGE_KEY);
}

export function getOrCreateIdempotencyKey() {
  if (typeof window === "undefined") return crypto.randomUUID();
  const existing = window.sessionStorage.getItem(IDEMPOTENCY_STORAGE_KEY);
  if (existing) return existing;
  const next = crypto.randomUUID();
  window.sessionStorage.setItem(IDEMPOTENCY_STORAGE_KEY, next);
  return next;
}
