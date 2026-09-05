import { resolveSiteUrl } from "@/lib/site-url";

export const site = {
  name: "SPL Homes",
  legalName: "SPL Homes",
  tagline: "Build Better. Live Better.",
  description:
    "New homes, renovations and property development across Wellington. SPL Homes works with homeowners, investors and developers from the first idea through planning, construction and handover.",
  locale: "en_NZ",
  language: "en-NZ",
  url: resolveSiteUrl(),
  instagram: "https://www.instagram.com/spl.homes",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "",
  address: process.env.NEXT_PUBLIC_ADDRESS ?? "",
  hours: "Business hours to be added",
  region: "Wellington region, New Zealand",
} as const;

export const placeholderNote =
  "Placeholder — replace with confirmed SPL Homes details in site settings.";

export function telHref() {
  return site.phone ? `tel:${site.phone.replace(/\s+/g, "")}` : "/contact";
}

export function mailHref() {
  return site.email ? `mailto:${site.email}` : "/contact";
}

export function phoneLabel() {
  return site.phone || "Call SPL Homes";
}

export function emailLabel() {
  return site.email || "Email SPL Homes";
}

export const nav = [
  { href: "/", label: "Home" },
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services/new-homes", label: "New Homes" },
      { href: "/services/renovations", label: "Renovations" },
      { href: "/services/extensions", label: "Extensions" },
      { href: "/services/design-build", label: "Design & Build" },
      { href: "/services/knockdown-rebuild", label: "Knockdown & Rebuild" },
      { href: "/services/property-development", label: "Property Development" },
      { href: "/services/commercial", label: "Commercial" },
    ],
  },
  { href: "/projects", label: "Projects" },
  { href: "/process", label: "Our Process" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
] as const;

export const budgetBands = [
  { id: "under-100", label: "Under $100k" },
  { id: "100-250", label: "$100k–$250k" },
  { id: "250-500", label: "$250k–$500k" },
  { id: "500-750", label: "$500k–$750k" },
  { id: "750-1000", label: "$750k–$1m" },
  { id: "1m-plus", label: "$1m+" },
  { id: "unsure", label: "Not sure" },
] as const;

export const timeframes = [
  { id: "immediately", label: "Immediately" },
  { id: "0-3", label: "0–3 months" },
  { id: "3-6", label: "3–6 months" },
  { id: "6-12", label: "6–12 months" },
  { id: "12-plus", label: "12+ months" },
  { id: "research", label: "Research stage" },
] as const;

export const projectStages = [
  { id: "researching", label: "Researching" },
  { id: "own-property", label: "Own the property / land" },
  { id: "concept", label: "Have concept plans" },
  { id: "drawings", label: "Have architectural drawings" },
  { id: "consent-underway", label: "Consent underway" },
  { id: "consent-approved", label: "Consent approved" },
  { id: "looking-builder", label: "Looking for a builder" },
  { id: "ready", label: "Ready to start" },
] as const;
