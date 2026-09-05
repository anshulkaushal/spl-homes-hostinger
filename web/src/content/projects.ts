export const projectTypes = [
  { id: "all", label: "All" },
  { id: "new_home", label: "New Homes" },
  { id: "renovation", label: "Renovations" },
  { id: "extension", label: "Extensions" },
  { id: "development", label: "Developments" },
  { id: "commercial", label: "Commercial" },
] as const;

export type ProjectTypeId = Exclude<(typeof projectTypes)[number]["id"], "all">;

export type ProjectImageAsset = {
  src: string;
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  location: string;
  projectType: ProjectTypeId;
  typeLabel: string;
  heroImage: string;
  gallery: ProjectImageAsset[];
  shortDescription: string;
  featured: boolean;
  sampleContent: true;
  completionYear?: string;
  floorArea?: string;
  bedrooms?: string;
  bathrooms?: string;
  clientBrief?: string;
  challenge?: string;
  solution?: string;
  outcome?: string;
};

const sampleNote = "SAMPLE CONTENT — not an SPL Homes project. Replace with a real case study.";

export const projects: Project[] = [
  {
    slug: "sample-karori-new-home",
    title: "Sample new home, Karori",
    location: "Karori, Wellington — sample location",
    projectType: "new_home",
    typeLabel: "New home",
    featured: true,
    sampleContent: true,
    completionYear: "Sample year",
    floorArea: "Sample floor area",
    bedrooms: "4",
    bathrooms: "2",
    shortDescription: `${sampleNote} A hillside new home used to show how a case study will read.`,
    heroImage:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
        alt: "Sample gallery image. Not an SPL Homes project.",
      },
      {
        src: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1400&q=80",
        alt: "Sample gallery image. Not an SPL Homes project.",
      },
    ],
    clientBrief: "Sample brief: a family home on a sloping Wellington section.",
    challenge: "Sample challenge: access, retaining and outdoor space on a hill site.",
    solution: "Sample solution: how a builder would sequence design, consent and construction.",
    outcome: "Sample outcome. Do not treat this as a completed SPL Homes job.",
  },
  {
    slug: "sample-island-bay-renovation",
    title: "Sample renovation, Island Bay",
    location: "Island Bay, Wellington — sample location",
    projectType: "renovation",
    typeLabel: "Renovation",
    featured: true,
    sampleContent: true,
    shortDescription: `${sampleNote} A kitchen and living renovation used as layout only.`,
    heroImage:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80",
        alt: "Sample renovation gallery image. Not an SPL Homes project.",
      },
    ],
    clientBrief: "Sample brief: keep the street character, open the back of the house.",
    challenge: "Sample challenge: working inside an existing Wellington villa.",
    solution: "Sample solution: staged strip-out, structure, then finish.",
    outcome: "Sample outcome. Replace before publishing as a real project.",
  },
  {
    slug: "sample-tawa-extension",
    title: "Sample extension, Tawa",
    location: "Tawa — sample location",
    projectType: "extension",
    typeLabel: "Extension",
    featured: true,
    sampleContent: true,
    floorArea: "Sample addition area",
    shortDescription: `${sampleNote} A single-storey addition used to demonstrate the gallery.`,
    heroImage:
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1400&q=80",
        alt: "Sample extension gallery image. Not an SPL Homes project.",
      },
    ],
    clientBrief: "Sample brief: extra living and a better connection to the garden.",
    challenge: "Sample challenge: joining new rooms cleanly to an existing house.",
    solution: "Sample solution: a simple roof and a clear junction detail.",
    outcome: "Sample outcome. Not a real SPL Homes result.",
  },
  {
    slug: "sample-porirua-development",
    title: "Sample development, Porirua",
    location: "Porirua — sample location",
    projectType: "development",
    typeLabel: "Development",
    featured: true,
    sampleContent: true,
    shortDescription: `${sampleNote} A two-unit infill used to show a development card.`,
    heroImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
        alt: "Sample development gallery image. Not an SPL Homes project.",
      },
    ],
    clientBrief: "Sample brief: add a second dwelling on a suburban section.",
    challenge: "Sample challenge: access, neighbours and a workable yield.",
    solution: "Sample solution: a compact pair with shared access.",
    outcome: "Sample outcome. Not an SPL Homes development.",
  },
  {
    slug: "sample-cbd-fitout",
    title: "Sample commercial fit-out, Wellington CBD",
    location: "Wellington CBD — sample location",
    projectType: "commercial",
    typeLabel: "Commercial",
    featured: false,
    sampleContent: true,
    shortDescription: `${sampleNote} A small office fit-out used as a commercial placeholder.`,
    heroImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
        alt: "Sample commercial gallery image. Not an SPL Homes project.",
      },
    ],
    clientBrief: "Sample brief: a compact office refresh around an operating business.",
    challenge: "Sample challenge: programme and after-hours work.",
    solution: "Sample solution: staged trades and a short shutdown.",
    outcome: "Sample outcome. Not a real SPL Homes commercial job.",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function featuredProjects() {
  return projects.filter((project) => project.featured);
}

export function plannerTypeForProject(project: Project) {
  return project.projectType;
}
