export const insightCategories = [
  "Building advice",
  "Renovations",
  "New homes",
  "Property development",
  "Design",
  "Building costs",
  "Building consent",
  "Wellington building",
] as const;

export type Article = {
  slug: string;
  title: string;
  category: (typeof insightCategories)[number];
  excerpt: string;
  date: string;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "how-much-does-it-cost-to-build-a-house-in-wellington",
    title: "How much does it cost to build a house in Wellington?",
    category: "Building costs",
    excerpt:
      "Why a single square-metre rate is the wrong starting point — and what actually moves the number.",
    date: "2026-09-05",
    body: [
      "People want a number. The honest answer is that a useful cost range only appears after you know the site, the size, the specification and the consent path.",
      "Wellington land is often the first cost driver you cannot wish away: retaining, foundations on a slope, difficult access, and wind or weathertight detailing all add work before anyone chooses a tapware. Two houses with the same floor area can be very different jobs.",
      "Specification is the second driver. A simple, well-detailed house can be a better building than a complicated one full of junctions. That is a design conversation, not a discount conversation.",
      "This article will not publish current build rates, council fees or “average Wellington house” figures. Those change, and a blog number becomes a quote in someone’s head. If you want a sense of your project, use the planner and include your budget band. We will talk in ranges that belong to your brief.",
    ],
  },
  {
    slug: "renovation-vs-rebuild",
    title: "Renovation vs rebuild: which makes more sense?",
    category: "Renovations",
    excerpt:
      "Keep the house, keep the land, or start again — a practical way to decide without romance.",
    date: "2026-09-05",
    body: [
      "The right question is not “which is cheaper on paper”. It is “which path gets you the house you need, on this section, with a level of disruption you can live with”.",
      "Renovation wins when the bones are good: structure, roof, and a layout that can be opened up without fighting the house at every wall. Rebuild wins when you are about to spend renovation money and still inherit a compromised plan, tired envelope, or rooms that will never face the sun.",
      "Sentiment matters, and it is allowed to. So does the title, the district plan, and whether you can stay on site. A knockdown also has demolition, waste and neighbour effects that a renovation does not.",
      "We will not give you a rule of thumb that pretends to be a calculation. Bring photos and what you dislike about the current house. That is enough to start a straight conversation.",
    ],
  },
  {
    slug: "what-happens-during-a-house-renovation",
    title: "What happens during a house renovation?",
    category: "Renovations",
    excerpt: "A plain sequence from brief to living in the rooms again — including the messy middle.",
    date: "2026-09-05",
    body: [
      "A renovation is a construction project that happens inside a house that already has a life. The sequence is familiar: brief, measure, design where needed, price, consent if required, then strip-out, structure, services, linings and finish.",
      "The part people underestimate is living through it — or moving out. Kitchens and bathrooms take a house offline in a way a new-build site never does. Decide that early. It changes programme and cost.",
      "You should expect dust, noise, and days when a decision is needed quickly because a wall came off and the existing house told a new story. Older Wellington houses do this often. A good builder tells you what they found and what it means, the same day if they can.",
      "Consent is not always required, and it is not never required. That depends on the work. We will not list exemptions here; they are easy to get wrong. If the job is more than cosmetic, ask before you start.",
    ],
  },
  {
    slug: "building-on-a-sloping-wellington-section",
    title: "Building on a sloping Wellington section",
    category: "Wellington building",
    excerpt: "Slope is not a problem to hide. It is the brief — if you face it early.",
    date: "2026-09-05",
    body: [
      "A sloping section can give you outlook, a garage under the house, and outdoor rooms that a flat paddock never will. It can also spend the budget on retaining and access before you have chosen a kitchen.",
      "The useful early work is boring: how you get a truck in, where water wants to go, how the neighbour sits above or below you, and whether the house should step with the land or sit on a platform. Those choices belong in the first design week, not after the floor plan is locked.",
      "Geotechnical advice is often part of a sloping-site project. We will not diagnose your land from a blog post. We will tell you when it is time to get the right report.",
      "If you already own a hill section — or you are thinking of buying one — start a project and say so. The conversation is different from a flat infill site.",
    ],
  },
  {
    slug: "how-long-does-building-consent-take",
    title: "How long does building consent take?",
    category: "Building consent",
    excerpt: "Why “the statutory clock” and “when you can start” are not the same thing.",
    date: "2026-09-05",
    body: [
      "Councils work to statutory timeframes, and they also request more information. A complete, well-coordinated application is the only part of the timeline you control.",
      "Resource consent, if you need it, is a different process and can sit in front of or beside the building consent. Neighbour approvals, traffic, earthworks and planning rules are not something a builder can wish away on your behalf.",
      "This article will not quote a typical number of weeks for Wellington, Porirua, Hutt City or Kāpiti. Those figures go stale and they ignore the quality of the documents. If someone gives you a guaranteed consent date before they have seen the drawings, be careful.",
      "What we can do is help you submit work that is buildable, coordinated and complete — then plan the start around a programme that can move when the council does.",
    ],
  },
  {
    slug: "how-to-choose-a-builder-in-wellington",
    title: "How to choose a builder in Wellington",
    category: "Building advice",
    excerpt: "Look past the tagline. Ask about the site, the communication, and the work they will show you.",
    date: "2026-09-05",
    body: [
      "Choose a builder the way you would choose a surgeon for a family member: competence first, manner second, and marketing last. A good website helps you start. It does not replace a conversation about your actual house.",
      "Ask to see work like yours — a villa renovation if you have a villa, a hill new-build if you have a hill. Ask who you will talk to once the job starts. Ask how they handle the moment the existing house does not match the drawing.",
      "Memberships, guarantees and star ratings can be useful when they are real. This site will not invent any of them for SPL Homes. You should ask every builder for the documents they actually hold.",
      "Then notice whether they listen. If they quote a number before they understand the site, keep looking.",
    ],
  },
  {
    slug: "what-should-be-included-in-a-building-quote",
    title: "What should be included in a building quote?",
    category: "Building costs",
    excerpt: "A useful quote is a scope, not a headline number.",
    date: "2026-09-05",
    body: [
      "The number at the bottom only means something if the page above it says what is in and what is out. Preliminaries, temporary works, demolition, connections, consents, allowances, and the finish level should be readable by a non-builder.",
      "Provisional sums and exclusions are not tricks if they are labelled. They are a problem when they hide the real cost of a kitchen, a driveway, or ground conditions nobody has investigated.",
      "Compare quotes on scope, not on who was cheapest on Friday. A lower number with a thinner specification is not a saving.",
      "SPL Homes will talk you through a proposal when we have enough brief. We will not put a sample quote on the internet that people treat as an offer.",
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
