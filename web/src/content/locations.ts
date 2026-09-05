export type LocationPage = {
  slug: string;
  name: string;
  region: string;
  lede: string;
  body: string[];
  services: string[];
};

export const coverageAreas = [
  { name: "Wellington City", slug: "wellington", confirmed: false },
  { name: "Porirua", slug: "porirua", confirmed: false },
  { name: "Tawa", slug: "tawa", confirmed: false },
  { name: "Johnsonville", slug: null, confirmed: false },
  { name: "Newlands", slug: null, confirmed: false },
  { name: "Churton Park", slug: null, confirmed: false },
  { name: "Lower Hutt", slug: "lower-hutt", confirmed: false },
  { name: "Upper Hutt", slug: "upper-hutt", confirmed: false },
  { name: "Kāpiti", slug: "kapiti", confirmed: false },
] as const;

export const locations: LocationPage[] = [
  {
    slug: "wellington",
    name: "Wellington City",
    region: "Wellington",
    lede: "Building in Wellington City usually means a tight site, weather that tests the envelope, and neighbours close enough to matter.",
    body: [
      "City and inner-suburb projects often turn on access: where a truck can sit, how materials get to the back of the section, and how long a demolition or excavation will affect the street. Those constraints should show up in the programme before they show up as a variation.",
      "Older housing stock — villas, bungalows, apartments above shops — rewards a builder who can renovate and extend without treating the existing house as a nuisance. New builds on leftover or steep land need the same honesty about retaining, foundations and outdoor space.",
      "SPL Homes’ confirmed coverage is still being recorded. If your project is in Wellington City, start the planner with the suburb and we will tell you whether we can take it on.",
    ],
    services: ["new-homes", "renovations", "extensions", "knockdown-rebuild"],
  },
  {
    slug: "lower-hutt",
    name: "Lower Hutt",
    region: "Hutt Valley",
    lede: "Lower Hutt has room for family new builds and serious renovations — and a mix of flat sections and hill suburbs that behave very differently on site.",
    body: [
      "On the valley floor, the conversation is often about existing houses that are sound but no longer fit how people live: closed kitchens, cold living rooms, and a back lawn that never quite connects to the house. An extension or a full renovation can be the right move.",
      "On the hills, access, retaining and wind become the brief as much as the floor plan. That is not unique to Lower Hutt, but it is common enough that we would rather walk the site early.",
      "Coverage is not assumed. Use the planner and include the suburb — Woburn, Waterloo, Stokes Valley, Eastbourne and the rest each have their own pattern.",
    ],
    services: ["new-homes", "renovations", "extensions", "property-development"],
  },
  {
    slug: "upper-hutt",
    name: "Upper Hutt",
    region: "Hutt Valley",
    lede: "Upper Hutt projects are often about space: a section that can take a new home, a minor dwelling, or a renovation that finally uses the land.",
    body: [
      "Compared with the inner city, many Upper Hutt sites give you more room to place a house and still keep outdoor living. That does not make consent or ground conditions automatic. Flooding, soil and access still need a straight look at the start.",
      "We talk to people here about new homes, knockdown-rebuilds, and developments that add a second dwelling. The right path depends on the title and what you want to keep.",
      "If you are in Upper Hutt, start a project and tell us the suburb. Confirmed service areas will be published when SPL Homes signs them off.",
    ],
    services: ["new-homes", "knockdown-rebuild", "property-development", "renovations"],
  },
  {
    slug: "porirua",
    name: "Porirua",
    region: "Porirua",
    lede: "Porirua is a mix of established suburbs, coastal weather and newer growth — which means new builds, renovations and the occasional development brief.",
    body: [
      "Coastal and hill sites ask more of cladding, decks and how the house meets the ground. Inland and established streets often present a different job: opening up a 1970s house or replacing one that has reached the end of a sensible renovation.",
      "If you are looking at a minor dwelling or a small multi-unit, the first questions are access, outlook and whether the existing house still earns its place on the land.",
      "Porirua is listed as a potential service area, not a confirmed one, until SPL Homes updates coverage.",
    ],
    services: ["new-homes", "renovations", "property-development", "design-build"],
  },
  {
    slug: "tawa",
    name: "Tawa",
    region: "Wellington",
    lede: "Tawa sits between city and coast in the way people live: family houses, state highway access, and a lot of renovation potential in mid-century stock.",
    body: [
      "Many Tawa houses were built for a different family pattern. The work is often a kitchen that joins the living room, a better connection to the garden, or a second living space upstairs or out the back.",
      "New builds and rebuilds happen here too, especially where the existing house is fighting insulation, layout and weathertightness at the same time.",
      "Tawa is included as a location people ask about. Treat coverage as unconfirmed until it is marked otherwise.",
    ],
    services: ["renovations", "extensions", "new-homes", "knockdown-rebuild"],
  },
  {
    slug: "kapiti",
    name: "Kāpiti",
    region: "Kāpiti Coast",
    lede: "Kāpiti work is often a coastal new home, a retirement move, or a renovation of a house that was built for holidays and is now everyday life.",
    body: [
      "Salt, wind and sandy or peat ground change how a house should be built and how it should be maintained. Those are site questions, not brochure lines.",
      "People also come with development ideas — a second dwelling, a subdivision conversation, or replacing a small house on a generous section. Feasibility belongs at the front.",
      "Kāpiti is a potential service area. Start the planner with the town — Paraparaumu, Waikanae, Raumati and others — and we will respond on whether we can help.",
    ],
    services: ["new-homes", "renovations", "property-development", "design-build"],
  },
];

export function getLocation(slug: string) {
  return locations.find((location) => location.slug === slug);
}
