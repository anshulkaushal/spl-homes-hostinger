export type Service = {
  slug: string;
  title: string;
  navTitle: string;
  eyebrow: string;
  lede: string;
  summary: string;
  image: string;
  cta: { href: string; label: string };
  plannerType: string;
  outcomes: string[];
  who: string;
  body: string[];
};

export const services: Service[] = [
  {
    slug: "new-homes",
    title: "New homes",
    navTitle: "New homes",
    eyebrow: "New home builds",
    lede: "A new house, planned around how you actually live — and built with a clear path from first conversation to handover.",
    summary: "Custom and design-led new homes across the Wellington region.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    cta: { href: "/start-your-project?type=new_home", label: "Start your project" },
    plannerType: "new_home",
    outcomes: [
      "A single point of contact through design, consent and construction",
      "Honest conversations about site, budget and sequence before you commit",
      "A build programme you can follow, not a black box",
    ],
    who: "Homeowners, family builders and people with land — or still looking for it.",
    body: [
      "Wellington sections are rarely straightforward. Slope, wind, access, neighbours and district plan rules all shape what is sensible to build. We start with the site and the brief, not a catalogue of standard plans.",
      "SPL Homes can work from your architect’s drawings or help you shape a design-and-build path. Either way, the aim is the same: a house that fits the land, the budget and the people who will live in it.",
      "This page does not list package prices. Build cost depends on design, specification, ground conditions and consent requirements. The project planner is the fastest way to tell us where you are up to.",
    ],
  },
  {
    slug: "renovations",
    title: "Renovations",
    navTitle: "Renovations",
    eyebrow: "Home renovations",
    lede: "Improve the home you already have — kitchen, bathroom, full refresh or a more structural change — with a builder who treats the existing house with care.",
    summary: "Kitchens, bathrooms, full renovations and structural alterations.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80",
    cta: { href: "/start-your-project?type=renovation", label: "Plan my renovation" },
    plannerType: "renovation",
    outcomes: [
      "A scope that matches how you live now, not a generic upgrade list",
      "Clear sequencing if you are staying in the house during the work",
      "Joinery, structure and finishing coordinated rather than handed between strangers",
    ],
    who: "People who like their street, their neighbours or their section — and want the house to catch up.",
    body: [
      "A good renovation starts with what to keep. Older Wellington villas, bungalows and 1960s houses each have a different logic. We look at structure, weathertightness, layout and the rooms that are failing you day to day.",
      "Some projects are a kitchen and bathroom. Others open the back of the house, move a stair, or bring light into rooms that have always felt closed. We will tell you if an extension or a rebuild is the more honest option.",
      "We do not publish typical renovation prices here. The right figure depends on the existing house and the finish you want. Use the planner and we will follow up with the next practical step.",
    ],
  },
  {
    slug: "extensions",
    title: "Home extensions",
    navTitle: "Extensions",
    eyebrow: "Home extensions",
    lede: "Add the space you are missing — a living room that opens to the garden, another bedroom, a studio — without losing what already works.",
    summary: "Thoughtful additions that connect cleanly to the existing house.",
    image:
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1400&q=80",
    cta: { href: "/start-your-project?type=extension", label: "Talk about your build" },
    plannerType: "extension",
    outcomes: [
      "An addition that feels like part of the house, not a bolted-on box",
      "Early thinking on structure, drainage and outdoor connection",
      "A brief that can go to design, consent and construction without being rewritten",
    ],
    who: "Growing households, people working from home, and anyone outgrowing a good house.",
    body: [
      "Extensions fail when they only solve floor area. The better question is how the new rooms join the old ones — light, circulation, roof lines and the way you move to the outdoor space.",
      "On sloping Wellington sites, a modest addition can be more involved than it looks. That is not a reason to avoid it. It is a reason to test the idea properly before drawings run ahead of the budget.",
      "If you already have concept sketches, bring them. If you do not, start with the planner and we will help you frame the brief.",
    ],
  },
  {
    slug: "design-build",
    title: "Design & build",
    navTitle: "Design & Build",
    eyebrow: "Design and build",
    lede: "One team from the first sketch to the last walk-through — so design decisions stay connected to how the house will be built.",
    summary: "A joined-up path from brief and concept through construction.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
    cta: { href: "/start-your-project?type=new_home", label: "Start your project" },
    plannerType: "new_home",
    outcomes: [
      "Design choices tested against buildability and budget as they develop",
      "Fewer hand-offs between people who have never met",
      "A single conversation about programme, not a chain of forwarded emails",
    ],
    who: "People who want help shaping the house, not only a quote on a finished drawing set.",
    body: [
      "Design and build is useful when the brief is still forming — or when you want the people who will construct the house in the room while it is being designed.",
      "It is not a shortcut past good design. It is a way of keeping design, cost and construction in the same conversation. You may still work with an independent architect or designer; we can also help you find the right design partner for the project.",
      "Tell us what you have in hand: a site, a scrapbook, a half-finished plan. We will tell you the cleanest next step.",
    ],
  },
  {
    slug: "knockdown-rebuild",
    title: "Knockdown & rebuild",
    navTitle: "Knockdown & rebuild",
    eyebrow: "Knockdown and rebuild",
    lede: "Keep the land you want. Replace the house that no longer works — after an honest look at renovation versus starting again.",
    summary: "Clear-eyed advice, then a new home on the section you already own.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
    cta: { href: "/start-your-project?type=knockdown_rebuild", label: "Start your project" },
    plannerType: "knockdown_rebuild",
    outcomes: [
      "A plain comparison of renovation versus rebuild for your house and site",
      "Early thinking on demolition, services and neighbour conditions",
      "A new-home process that starts from land you already understand",
    ],
    who: "Owners of tired houses on good sections — especially where the layout or weathertightness has run out of road.",
    body: [
      "Rebuild is not automatically the better choice. Sometimes a well-planned renovation and extension will do more, for less disruption. Sometimes the existing house is fighting every change you want to make.",
      "We would rather have that conversation early than discover it after you have paid for the wrong drawings. Site access, existing services, covenants and what you want from the next twenty years all matter.",
      "If you are still weighing it up, read our insight on renovation versus rebuild, then start a project so we can look at your place specifically.",
    ],
  },
  {
    slug: "property-development",
    title: "Property development",
    navTitle: "Property development",
    eyebrow: "Development and multi-unit",
    lede: "Feasibility-minded building for investors and landowners — infill, minor dwellings and small multi-unit projects.",
    summary: "Practical delivery for people unlocking a section or a small development.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
    cta: { href: "/start-your-project?type=development", label: "Discuss my development" },
    plannerType: "development",
    outcomes: [
      "A builder who understands that yield, programme and build quality all have to hold",
      "Early questions about access, parking, outdoor space and neighbour effects",
      "A path that can sit alongside your planner, surveyor and designer",
    ],
    who: "Landowners, investors and people exploring a minor dwelling or small multi-unit project.",
    body: [
      "Wellington infill is rarely a simple extra house on the back lawn. Servicing, outlook, privacy and construction access decide whether a project is worth taking further.",
      "We are not a volume franchise turning out identical units. We are a building company that can work with you and your consultants on projects that need care, not just speed.",
      "Bring the address and what you are hoping the land can do. We will be direct about whether it looks like a conversation worth having.",
    ],
  },
  {
    slug: "commercial",
    title: "Commercial & fit-outs",
    navTitle: "Commercial",
    eyebrow: "Commercial building",
    lede: "Fit-outs and smaller commercial work for businesses that want the same clarity we bring to houses.",
    summary: "Fit-outs and commercial building where a personal building team still makes sense.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
    cta: { href: "/start-your-project?type=commercial", label: "Request a consultation" },
    plannerType: "commercial",
    outcomes: [
      "A scoped fit-out that can sit around trading hours where needed",
      "Straightforward communication with landlords, designers and suppliers",
      "The same quality bar we apply to residential work",
    ],
    who: "Local businesses, professional rooms and owners of small commercial spaces.",
    body: [
      "Not every commercial project needs a large contracting firm. Many Wellington fit-outs and alterations are the size of a serious house renovation — and they benefit from the same habits: clear scope, tidy sites and one person who answers the phone.",
      "Tell us about the tenancy, the drawings you have, and when you need to be open. We will say quickly if it is a good fit.",
    ],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
