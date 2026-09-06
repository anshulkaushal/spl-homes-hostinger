# SPL Homes website architecture

**Product:** SPL Homes — Wellington residential building, lead generation  
**Primary objective:** Generate qualified building leads  
**Companion documents:** `CURRENT-SITE-AUDIT.md`, `IMPLEMENTATION-PLAN.md`, `DEPLOYMENT.md`  
**Updated:** 6 September 2026

This is a clean modular monolith. Public content lives in typed TypeScript modules. Leads persist to Hostinger MySQL in staging/production, or a local JSON file in development. Admin CMS is deferred.

Do not invent testimonials, awards, years in business, project counts, guarantees, certifications, memberships, prices, or client names.

---

## 1. Next.js application structure

The live product is `/web` (Next.js App Router, TypeScript, Tailwind v4, Node 22).

```
web/
  src/app/                 routes, metadata, API
  src/components/          layout, home, planner, media, forms, seo
  src/content/             typed copy and models
  src/lib/                 leads, planner, SEO, analytics, UTM
  prisma/                  MySQL schema + migrations
  e2e/                     Playwright
  data/leads.json          local lead fallback (gitignored)
```

Shared layout is `src/app/layout.tsx`: skip link, header, main, footer, mobile action bar, UTM capture, HomeAndConstructionBusiness JSON-LD. No fabricated ratings.

---

## 2. Route structure

```
/                                   Home
/services                           Services index
/services/new-homes
/services/renovations
/services/extensions
/services/design-build              (legacy /design-and-build redirects here)
/services/knockdown-rebuild
/services/property-development
/services/commercial
/projects                           Gallery
/projects/[slug]                    Case study (sample content until real jobs exist)
/process
/about
/where-we-build
/builders/[location]                Unique location copy only
/start-your-project                 Project planner
/insights
/insights/[slug]
/contact
/faq
/privacy
/terms
/admin                              Minimal lead list only
/api/leads                          Lead intake
```

---

## 3. Shared layout

- Sticky header: logo, Home, Services dropdown, Projects, Our Process, About, Insights, Contact, **Start your project**
- Accessible mobile hamburger
- Persistent mobile bar: **Call** | **Start project** (hidden on planner/admin; page padding so it does not cover content)
- Footer: explore, services, NAP placeholders, legal
- Skip link to `#main`

---

## 4. Component architecture

**Primitives:** `Button`, `Container`, `Section`, `Eyebrow`, `PageHero`, `CtaBand`, `Placeholder`  
**Chrome:** `SiteHeader`, `SiteFooter`, `MobileStickyCta`, `SkipLink`  
**Media:** `HeroImage`, `ProjectImage`, `Gallery`, `Lightbox`, `BeforeAfterSlider`  
**Marketing:** homepage sections, `ServiceCard`, `Breadcrumbs`  
**Planner:** `ProjectPlanner` + `src/lib/planner.ts`  
**Forms:** `QuickEnquiry`, `LeadMagnet` → `/api/leads`

Keep conversion forms on the shared intake path. Do not call GA4 from cards.

---

## 5. Content model

**Decision:** typed content objects in `web/src/content/*`.

Why this, not MDX or a CMS, for this iteration:

- Copy is still being written and needs review
- No admin authoring workflow yet
- TypeScript gives required fields and compile-time checks
- Fast to ship and easy to later move a module into MySQL

MDX can wait for Insights volume. Database-backed admin content waits until the public lead path is proven.

Unknown facts use explicit placeholders.

---

## 6. Project / case-study model

Typed `Project` in `src/content/projects.ts` (Prisma `Project` exists for a later CMS):

`slug`, `title`, `location`, `projectType`, `heroImage`, `gallery`, `shortDescription`, `featured`, optional `completionYear`, `floorArea`, `bedrooms`, `bathrooms`, `clientBrief`, `challenge`, `solution`, `outcome`, `sampleContent: true`.

Filters: All, New Homes, Renovations, Extensions, Developments, Commercial.

Current cards are **SAMPLE CONTENT**, not SPL Homes jobs.

---

## 7. Lead model

Human reference `SPL-YYMMDD-XXXX`. Sequential database IDs are never shown.

| Field | Notes |
| --- | --- |
| id, reference, createdAt, updatedAt | internal |
| name, email, phone, preferredContact | contact |
| projectType | `new_home` \| `renovation` \| `extension` \| `knockdown_rebuild` \| `development` \| `commercial` \| `unsure` |
| locationSuburb, locationRegion, streetAddress | address |
| projectStage, budgetRange, timeframe, projectDetails | qualification |
| source | `planner` \| `contact` \| `guide` |
| landingPage, utm_*, gclid, fbclid | attribution |
| status | NEW → CONTACTED → QUALIFIED → CONSULTATION_BOOKED → PROPOSAL → WON / LOST / ARCHIVED |
| consent, consentAt, marketingConsent, marketingConsentAt | timestamps stored |
| isSynthetic | CI only |
| idempotencyKey | duplicate submit protection |

---

## 8. Project Planner architecture

Route: `/start-your-project`. Eight steps, then a success state:

1. Project type  
2. Location  
3. Project stage  
4. Project details (conditional)  
5. Indicative budget  
6. Timeframe  
7. Contact details  
8. Review / submit  

Conditional profiles:

- `new_home` / `knockdown_rebuild`: land, floor area, beds/baths, storeys, garage, plans  
- `renovation` / `extension`: kitchen, bathroom, extension, full reno, structural, exterior, other  
- `development`: dwellings + land  
- `commercial`: occupied during works  
- `unsure`: notes only  

Draft for steps 1–6 is stored in `sessionStorage`. Name, email and phone are not persisted. Draft and idempotency key clear on success.

---

## 9. Admin architecture

`/admin` is a password gate and a lead table. Synthetic leads are labelled. No CMS polish in this iteration.

---

## 10. SEO architecture

`createMetadata()` sets title, description, canonical, robots, Open Graph, Twitter.

- Homepage: `HomeAndConstructionBusiness` only — no AggregateRating, Review, or awards  
- Service pages: `Service` schema  
- Nested pages: `BreadcrumbList`  
- `/sitemap.xml` from published typed content  
- `/robots.txt` + `X-Robots-Tag` on staging/local  
- `/services/design-and-build` → `/services/design-build`

---

## 11. Analytics event model

Central helper: `src/lib/analytics.ts`. Components call `track()`, never `gtag` directly.

| Event | When |
| --- | --- |
| project_planner_started | first planner interaction |
| project_type_selected | type chosen |
| project_planner_step_completed | Continue |
| project_planner_completed | reference issued |
| lead_form_submitted | planner, contact, or guide |
| phone_clicked / email_clicked | tel / mailto |
| project_viewed / service_viewed | case study / service |
| guide_downloaded | lead magnet success |

UTM + `gclid` / `fbclid` persist in session storage (first touch kept, last touch updated) and attach to every lead.

Scripts inject only when an ID exists and `APP_ENV=production`.

---

## 12. Image strategy

`next/image` with AVIF/WebP, reserved aspect boxes, blur placeholder, lazy galleries, priority heroes.

Reusable: `HeroImage`, `ProjectImage`, `Gallery`, `Lightbox`, `BeforeAfterSlider`.

Current photography is Unsplash **placeholder** imagery. Replace with SPL Homes files before production cutover. Honour `prefers-reduced-motion`.

---

## 13. Database recommendation

**Hostinger MySQL** via Prisma. Business hosting has MySQL only. The old brochure site had no database.

| Environment | Persistence |
| --- | --- |
| Local | `USE_MYSQL=false` → `web/data/leads.json`. Dummy `DATABASE_URL` is enough for `prisma generate`. Optional: local MySQL + `USE_MYSQL=true` + `npx prisma migrate deploy` |
| Staging | Dedicated Hostinger MySQL. `USE_MYSQL=true`. `prisma migrate deploy` during Hostinger build. Keep the existing staging `DATABASE_URL`. |
| Production | Hostinger MySQL `u182465577_splhomes_prod` via `localhost:3306` in the Web App env. Guarded `prisma migrate deploy` during `build:hostinger`. |

Setup:

1. Copy `web/.env.example` to `web/.env`  
2. Keep `USE_MYSQL=false` until a real MySQL URL exists  
3. `cd web && npm install && npm run dev`  
4. When MySQL is ready: set `DATABASE_URL` and `USE_MYSQL=true`, then `npx prisma migrate deploy`

Never point local or staging at a production database. Production migrations run only on the Hostinger production app through the guarded `migrate:deploy` path. The live production database is `u182465577_splhomes_prod`. External tools may use `srv1518.hstgr.io`; the production Web App must keep `localhost`.

---

## 14. Form validation and security

- Zod on the server (`lead-schema.ts`). Frontend checks are convenience only  
- Honeypot `company`  
- In-process IP rate limit (8s), skipped for authorised CI  
- Idempotency key header or body  
- `isSynthetic` is **not** taken from the client. Only `x-ci-lead-marker` matching `CI_LEAD_MARKER`  
- Security headers in `next.config.ts`  
- No secrets in the client bundle  

---

## 15. Environment separation

| | Local | Staging | Production |
| --- | --- | --- | --- |
| `APP_ENV` | local | staging | production |
| Indexing | noindex | Disallow `/` + `X-Robots-Tag` | indexable |
| URL | localhost:3000 | staging host | `https://spl-homes.com` |
| Analytics | off | off | on when IDs set |
| Database | file or local MySQL | existing staging MySQL | `u182465577_splhomes_prod` @ `localhost` |
| Deploy | local only | GitHub Actions → Hostinger | manual `deploy-production.yml` only |

GitHub Actions is the only release trigger. Hostinger builds and runs Next.js. Do not change DNS or the working production `DATABASE_URL` from these workflows.

---

## Design system

Architectural and editorial, not a SaaS dashboard.

- Display: Newsreader. Body: Source Sans 3  
- Ink / paper / forest / timber / stone  
- Page width `max-w-6xl`, section padding `py-20 sm:py-28`  
- Cards are square-edged paper surfaces, not glass pills  
- Motion: 200–300ms colour/transform; none when `prefers-reduced-motion`  
- Focus: 2px forest outline, 3px offset  
- Touch targets ≥ 44px  
- Breakpoints: default / `sm` / `md` / `lg`

Avoid: heavy gradients, glassmorphism, cartoon icons, bounce animations, invented social proof.

---

## Accessibility

Target WCAG 2.2 AA: landmarks, sequential headings, labels, error text, lightbox focus return, Escape to close menus, contrast on forest/paper, mobile bar padding, reduced motion.
