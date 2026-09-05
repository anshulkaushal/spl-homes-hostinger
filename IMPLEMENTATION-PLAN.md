# IMPLEMENTATION-PLAN

**Product:** SPL Homes lead-generation website  
**Based on:** `CURRENT-SITE-AUDIT.md`, `SPL-WEBSITE-ARCHITECTURE.md`  
**Date:** 5 September 2026

Work in stages. Do not overwrite the live Hostinger site. Do not change DNS. Stop before production deployment.

---

## 0. Guardrails (every phase)

- New application lives in `/web`. Hostinger Node.js Web App root directory = `web`.
- Runtime: Node.js 22. Database: Hostinger MySQL + Prisma.
- Do not attach the new app to the live production domain.
- No invented testimonials, stats, awards, prices, or project names.
- Placeholders must be obviously labelled for an administrator.
- New Zealand English. Conversion CTAs, not “Contact Us”.
- Do not activate analytics without IDs.
- Do not deploy to `public_html` or production.

---

## Phase 1 — Audit (complete)

**Deliverable:** `CURRENT-SITE-AUDIT.md`

Completed. Findings in short:

- Static HTML brochure on Hostinger shared hosting
- Placeholder NAP, fake projects, unverified stats
- Formspree + broken mailto
- No Wellington IA, planner, CMS, or analytics
- Rebuild required; keep live files untouched

**Exit:** Audit accepted as the description of “what exists”.

---

## Phase 2 — Architecture (complete)

**Deliverable:** `SPL-WEBSITE-ARCHITECTURE.md`

Completed. Decisions in short:

- Next.js + TypeScript + Tailwind + Hostinger MySQL + Prisma
- Hostinger Business managed Node.js (not VPS, not Vercel)
- Staging host such as `staging.splhomes.co.nz`; production `splhomes.co.nz` later only
- Conversion IA, schema rules, admin, UTM, security, environments

**Exit:** Architecture accepted before further CMS/database work is treated as final.

---

## Phase 3 — This plan (complete)

**Deliverable:** `IMPLEMENTATION-PLAN.md` (this file)

**Exit:** Team follows phases 4–8 in order. Phase 4 may begin immediately because it uses file-based content and does not require production database changes.

---

## Phase 4 — Design system and homepage

**Goal:** A visitor can complete the five-second test and take a primary CTA.

### 4.1 Scaffold

- Create Next.js App Router app in `/web`
- TypeScript, Tailwind, ESLint, `src/`
- Environment files: `.env.example` for local / staging / production keys
- `APP_ENV`, `SITE_URL`, `NOINDEX` flags
- Copy interim logo/favicon into `web/public`

### 4.2 Design system

- Tokens: ink, paper, forest, timber, stone
- Fonts: Newsreader + Source Sans 3
- Primitives: Button, fields, Section, Container, Placeholder
- Chrome: header, footer, skip link, mobile sticky CTA
- Motion + `prefers-reduced-motion`

### 4.3 Homepage sections (all)

1. Hero — Build Better. Live Better. / Start Your Project / View Our Projects / Talk to SPL Homes
2. What are you planning? — seven intent cards
3. Why SPL Homes — benefits, no guarantees
4. Featured projects — placeholder cards + filters
5. Process timeline — eight stages, expandable
6. Renovation before/after slider
7. Service areas — configurable list, not claimed coverage
8. Trust — honest placeholders
9. Lead magnet — name, email, project type, consent
10. Final CTA — Start Your Project / Call (placeholder number)

### 4.4 Supporting routes (thin but real)

Ship unique metadata and a sensible CTA on:

- Services index + seven service pages
- Projects, Process, About, Where we build
- Start your project (shell; full wizard in Phase 5)
- Insights index, Contact, FAQ
- Privacy, Terms (legal-review placeholders)
- Custom `not-found`

Lead magnet and contact posts may validate on the server and return a clear “stored when the enquiry database is live” state **or** write to a local JSON/dev store. Prefer wiring the API shape now so Phase 5 only adds Prisma.

### 4.5 Quality gate (Phase 4)

- Desktop / tablet / mobile layout of home
- Keyboard through header, intents, timeline, slider, forms
- No horizontal overflow
- Lighthouse home (local) as a baseline, not a vanity pass
- Existing root Hostinger files unchanged

**Exit:** Homepage is the conversion surface. Inner pages exist so navigation is not dead.

---

## Phase 5 — Services depth, projects, planner, leads

**Goal:** Qualified enquiries persist and case studies can be published.

### 5.1 Database

- Add Prisma + Hostinger MySQL
- Migrations for users, leads, projects, images, testimonials, articles, locations, services, faqs, settings
- Local: `DATABASE_URL` if MySQL is available; otherwise file-backed leads so `npm run dev` still works
- Seed: admin user from env, default settings, unpublished location/service shells, **zero** fake reviews

### 5.2 Project planner

Eight steps as specified. Conditional step 4. Configurable budget bands. Generate `SPL-YYMMDD-XXXX`. Confirmation + what happens next.

### 5.3 Lead APIs

- Planner, quick enquiry, lead magnet
- UTM cookie → lead columns
- Honeypot + rate limit
- Zod validation
- Optional email notification via env SMTP (off if unset)

### 5.4 Projects

- Gallery: filter, lazy load, lightbox, keyboard, swipe
- Case study template with optional fields and valid schema
- Prefill planner from “Start a similar project”

### 5.5 Service / process / location templates

- Full service pages with internal links
- Process page with stage CTAs
- Location pages unpublished by default

### 5.6 Quality gate

- Planner happy path + each project type
- Row appears in MySQL (or local file store if DATABASE_URL is unset)
- Spam honeypot dropped
- Gallery a11y
- Automated tests: planner submit, enquiry validation, reference format

**Exit:** A real enquiry can be created locally without inventing marketing claims.

---

## Phase 6 — Admin CMS

**Goal:** SPL staff can run the site without a developer.

- `/admin` login
- Dashboard metrics
- Leads CRUD-lite: status, notes, CSV export
- Projects + images
- Testimonials, insights, services, locations, FAQs
- Settings: NAP, hours, socials, budget bands, coverage, tracking IDs

### Quality gate

- Session works; unauthenticated `/admin` redirects
- Create/edit/unpublish a project and see it on the public site
- Export CSV
- Admin is noindex

**Exit:** Content and leads are operable.

---

## Phase 7 — SEO, analytics, a11y, security, performance

**Goal:** Hardening to the stated score targets.

- Unique metadata audit per route
- Sitemap + robots (assets allowed)
- Valid JSON-LD only
- Breadcrumbs
- Insights sample articles (advice, no fake prices/regs) — only if still missing
- Analytics stub: event helper + GTM/GA4/Meta inject-if-configured
- CSP and remaining headers
- Rate limits / CSRF review
- Image optimisation pass
- Focus, contrast, reduced motion pass
- 404 / 500
- Playwright or equivalent: planner, contact, admin login, metadata smoke
- Lighthouse on home, a service, planner, a project

**Exit:** Checklists in architecture §6, §10–§13 are implemented, not just documented.

---

## Phase 8 — Staging only

**Goal:** Reviewable Hostinger Node.js staging. Production stays live.

### In scope

- Create a **new** Hostinger Node.js Web App (not the live website slot)
- GitHub Actions is the deploy trigger (see `DEPLOYMENT.md`); Node 22
- Disable Hostinger Git auto-deploy so it cannot race Actions
- Host on `staging.splhomes.co.nz` or a Hostinger temporary domain
- Create a **staging** MySQL database; set `DATABASE_URL` in the Web App env
- Run Prisma migrations against **staging only**
- `APP_ENV=staging`, `NOINDEX=true`, tracking IDs empty
- Confirm `robots.txt` Disallow: / and `X-Robots-Tag: noindex, nofollow`
- Walk through planner, contact, admin, SEO metadata
- Cross-browser pass: Chrome, Edge, Safari-equivalent
- Device pass: mobile, tablet, desktop

### Out of scope (hard stop)

- Production deploy
- DNS changes for `splhomes.co.nz` or the current live host
- Deleting or replacing the live website
- Production MySQL
- Launch ads / production analytics

**Exit:** Staging URL + credentials handed over. Live site still the current brochure.

See `HOSTINGER-DEPLOYMENT.md`.

---

## Workstreams after this programme (not scheduled)

- Production cutover plan (redirects, GSC, NAP consistency)
- Real photography, projects, testimonials
- Lead magnet PDFs
- Confirmed coverage and phone/email
- Google Business Profile
- Optional: retire or rebuild the Expo app so it does not publish fake stats
- Optional: design-tool embeds on a dedicated page, only with working project IDs

---

## Suggested sequencing inside the repo

```
/                           existing Hostinger static site (do not delete)
/CURRENT-SITE-AUDIT.md
/SPL-WEBSITE-ARCHITECTURE.md
/IMPLEMENTATION-PLAN.md
/web                        new Next.js application
  /src
  /prisma                   from Phase 5
  /public
```

---

## Testing matrix (complete before calling the site done)

| Area | Local | Staging |
| --- | --- | --- |
| Navigation all routes | Phase 4+ | Phase 8 |
| Planner + DB persist | Phase 5 | Phase 8 |
| Quick enquiry + magnet | Phase 5 | Phase 8 |
| Spam controls | Phase 5–7 | Phase 8 |
| Galleries / lightbox | Phase 5 | Phase 8 |
| Admin + CSV | Phase 6 | Phase 8 |
| Metadata, robots, sitemap | Phase 7 | Phase 8 |
| Structured data (no fake ratings) | Phase 7 | Phase 8 |
| 404 / 500 | Phase 7 | Phase 8 |
| Analytics events (debug) | Phase 7 | Optional |
| UTM → lead | Phase 5–7 | Phase 8 |
| Keyboard / reduced motion | Phase 4–7 | Phase 8 |
| Chrome / Edge / WebKit | Phase 4 visual | Phase 8 |
| Mobile sticky CTA | Phase 4 | Phase 8 |

Automated tests are mandatory for planner completion, enquiry validation, admin auth, and reference generation.

---

## Immediate next action

**Phase 4 is in progress in `/web`.** Root Hostinger files stay as they are.
