# CURRENT-SITE-AUDIT

**Subject:** Existing SPL Homes Hostinger website and this repository  
**Date:** 5 September 2026  
**Scope:** Architecture, pages, assets, SEO, forms, performance, security, reusable work, content worth keeping, and technical debt  
**Live site inspected:** [https://spl-homes.com/](https://spl-homes.com/)  
**Repository:** `spl-homes-hostinger` (`origin`: `https://github.com/anshulkaushal/spl-homes-hostinger`)

This audit describes what exists today. It does not recommend a rebuild by itself — that recommendation is in `SPL-WEBSITE-ARCHITECTURE.md`.

---

## 1. Executive summary

The current site is a **static brochure** deployed to Hostinger shared hosting. It is not a lead-generation platform.

What exists:

- Two public HTML pages (`index.html`, `design.html`)
- Client-side CSS/JS
- An Expo React Native companion app that mirrors the same placeholder content
- Basic SEO files (`robots.txt`, `sitemap.xml`, `.htaccess`, Google verification HTML)
- A Formspree contact form and a mailto-based design form
- Placeholder business details, placeholder projects, and unverified claims

What does not exist:

- Wellington market positioning
- Multi-page service, project, process, location, insights, or legal architecture
- A project planner or qualified-lead capture
- A lead database or admin CMS
- First-party analytics, conversion events, or UTM persistence
- Real project photography, testimonials, certifications, or company facts
- A backend, database, authentication, or environment-based config

**Verdict:** The live site cannot meet the primary business objective (qualified building leads and new projects). A rebuild is appropriate. The existing Hostinger static files should stay in place until a **staging** site is approved. This audit must not be used as a licence to overwrite production.

---

## 2. Existing architecture

### 2.1 Frontend

| Item | Current state |
| --- | --- |
| Stack | Plain HTML, CSS, and vanilla JavaScript |
| Framework | None |
| CSS | Single file `css/style.css` (~163 lines), custom properties, no design system |
| JS | `js/main.js` (project data + filters), `js/version.js` (version badge) |
| Fonts | Google Fonts Inter |
| Routing | Single-page anchors on `index.html` plus a separate `design.html` |
| Components | No reusable component layer. Cards, filters, and forms are one-off markup |
| Images | SVG logo/favicon locally; hero and projects loaded from Unsplash CDNs |

The visual language is a generic “construction company template”: corporate blue (`#0a5a9c`), rounded cards, emoji service icons, gradient buttons, and stock photography. It does not communicate a Wellington residential builder.

### 2.2 Backend

There is **no application backend**.

- Contact form posts to a third-party Formspree endpoint
- Design form composes a `mailto:` URL (`EMAIL@YOURDOMAIN` is still a placeholder)
- No API, no sessions, no CMS, no lead store

### 2.3 Database

None. Project listings are a hardcoded JavaScript array in `js/main.js`.

### 2.4 Hostinger deployment model

Documented in `README.md`:

1. Zip the static files
2. Upload/extract into Hostinger `public_html/`
3. `index.html` must sit at the web root

Supporting Hostinger artefacts:

- `.htaccess` — HTTPS redirect, optional www rule (commented), trailing-slash rewrite, gzip, cache headers, partial security headers
- `version.json` + floating version badge (currently `1.0.0`)
- `mobile-app/README-HOSTINGER.md` — Expo app loads `https://spl-homes.com/design.html`

This is **static files on Hostinger**, not a Node.js Web App. The live brochure can stay in its current website slot. The rebuild targets a **separate** Hostinger Business Node.js Web App plus Hostinger MySQL. Do not replace the live slot during development.

### 2.5 Domain structure

| Signal | Value |
| --- | --- |
| Canonical domain in markup | `https://spl-homes.com/` |
| Google Search Console file | `googleb17bb9fe9b21dae0.html` (verification token present) |
| Locale in Open Graph | `en_US` (not `en_NZ`) |
| Contact schema | US-style placeholder phone `+1 234 567 890` |
| Area served in schema | `"Country"` — not New Zealand / Wellington |
| Instagram | `https://www.instagram.com/spl.homes` (only real third-party brand URL found) |

No `/builders/{suburb}`, service landing pages, blog, or legal routes exist.

### 2.6 Git history (what this repo actually is)

Recent commits describe a rapid static-site + SEO pass, not a marketed product:

- `Initial commit` → image/SEO tweaks → “Made it more flashy” → Planner/version → “connected to hsotinger” → Google SEO file

The site reads as a starter template that was published, not as a finished SPL Homes marketing system.

---

## 3. Existing pages

### 3.1 Home (`index.html` / `/`)

Single page with hash sections:

| Section | Purpose | Conversion quality |
| --- | --- | --- |
| Header | Logo, Services, Projects, About, Design, Contact | Contact is the only CTA; no “Start your project” |
| Hero | “Quality homes. Delivered on time.” | Generic. CTAs are Explore Projects / Get a Quote |
| Services | 3 cards: General Contracting, Design & Build, Structural & Civil Works | No links to service pages. Emoji icons |
| Projects | Filter chips + JS-rendered cards | Fake project names, Unsplash images, USD prices, “Enquire” → `#contact` |
| About | Short paragraph + unverified stats | Claims 50+ projects, 10+ years, 100% on-time handover |
| Contact | Placeholder phone/email/address + Formspree | US phone, `info@splhomes.com`, “Main Street, City, Country” |
| CTA band | “Ready to build your dream home?” | Cliché. Links to `#contact` |
| Footer | Copyright, Instagram, dead Facebook/LinkedIn `#` links | |

Missing homepage jobs: intent selector, process, renovation story, service areas, trust placeholders that are honest, lead magnet, Wellington positioning.

### 3.2 Design (`design.html`)

A dark-theme “design your dream home” experiment.

- Tabs embed Floorplanner, Planner 5D, and SketchUp — **embed URLs are placeholders**
- Lead form collects name, email, phone, location, budget (hard-coded NZD bands), timeline, tool used, share link, notes
- Submit uses `mailto:EMAIL@YOURDOMAIN` — it does not store a lead
- Visual system is unrelated to the homepage (neon/dark SaaS look)

The **idea** (let people explore a layout, then send a brief) is useful. The implementation is not production-ready and should not be copied visually.

### 3.3 Pages that do not exist

Services (and each service), Projects index, project case studies, Process, About (as a real page), Where we build, Project planner, Insights, Contact (as a dedicated page), FAQ, Privacy, Terms.

Hash URLs (`/#services`) are listed in the sitemap as if they were pages. Search engines do not treat fragments as separate URLs.

---

## 4. Existing assets

| Asset | Location | Reuse? |
| --- | --- | --- |
| Logo SVG | `assets/img/logo.svg` | **Yes, with caution.** House-mark in teal-green (`#0b5c4a` → `#0e8067`). Treat as interim brand mark until a final identity is supplied. |
| Favicon SVG | `assets/img/favicon.svg` | Reuse as interim favicon |
| OG image | Referenced as `/assets/img/og-image.png` | **File is missing.** Social shares will fail |
| Hero / project photos | Remote Unsplash URLs | Do **not** present as SPL Homes work |
| Mobile app icons/splash | Documented but `assets/` in the app is essentially empty (`.gitkeep`) | Not reusable |
| Google verification | `googleb17bb9fe9b21dae0.html` | Preserve token when the new domain/host is verified; do not assume it remains valid after a stack change |

There is **no owned project photography** in the repository.

---

## 5. SEO

### 5.1 What is in place

- Title and meta description on both HTML pages
- Canonical tags pointing at `https://spl-homes.com/`
- Open Graph and Twitter tags
- `robots.txt` and `sitemap.xml`
- JSON-LD: `LocalBusiness`, `Organization`, `WebSite` (+ fabricated `SearchAction`)
- Project cards use `schema.org/Product` + `Offer` (inappropriate for case studies; prices are invented)
- `.htaccess` HTTPS redirect
- Google site verification file
- Heading hierarchy on the homepage is basically sane (one `h1`, section `h2`s)

### 5.2 What is wrong or harmful

| Issue | Detail |
| --- | --- |
| Wrong market | Copy, locale, phone, and `areaServed` are not Wellington / New Zealand |
| Keyword stuffing | Meta keywords list generic global construction terms |
| Fabricated trust | Stats, “ISO-inspired QA/QC”, “licensed professionals” are not evidenced in this repo |
| `robots.txt` blocks CSS/JS | `Disallow: /assets/`, `/js/`, `/css/` can impair rendering and image discovery |
| Sitemap includes `#` URLs | Invalid. Only `/` and `/design.html` are real documents |
| SearchAction schema | Points at `/?s={search_term_string}` — no site search exists |
| Empty geo | Latitude/longitude are empty strings |
| Missing pages | No unique titles/descriptions for services, locations, projects, advice |
| No local SEO | No suburb/service landing pages |
| No blog/insights | No organic content engine |
| OG image 404 | Referenced PNG does not exist |
| Locale | `og:locale` is `en_US` |
| Thin content | Two pages cannot compete for “Wellington builders”, renovations, or knockdown/rebuild |

The existing `SEO-CHECKLIST.md` ticks many boxes that are only *structurally* present. Several “completed” items are incomplete or incorrect (real address, real OG image, GSC submission, analytics).

---

## 6. Forms and lead capture

| Form | Fields | Destination | Gaps |
| --- | --- | --- | --- |
| Homepage contact | Name, email, message | Formspree `https://formspree.io/f/xyyvlqkp` | No project type, phone, consent checkbox, honeypot, rate limit, UTM, or CRM |
| Design page | Name, email, phone, location, budget, timeline, tool, link, notes | `mailto:` placeholder | Does not persist. Budget bands are hard-coded. “Free design review” is an unverified offer |

There is no project planner, no lead magnet, no enquiry reference, no status workflow, and no admin view.

Spam protection is whatever Formspree provides on the homepage, and nothing on the design form.

---

## 7. Performance

Not lab-tested in this audit (no Lighthouse run against a controlled staging build). Observed characteristics:

**Helpful**

- Tiny CSS/JS payload
- No framework runtime
- Lazy `loading="lazy"` on project images
- Gzip and long-cache headers in `.htaccess`

**Harmful**

- Hero is a large remote Unsplash JPEG as a CSS `background-image` (no `srcset`, no AVIF/WebP, no LCP preload)
- Project images are 1000px Unsplash URLs, not responsive `srcset`
- Render-blocking Google Fonts
- Third-party Formspree dependency
- Design page loads three heavy iframe ecosystems (even if unused)
- Floating version badge on every page
- No image CDN or local optimised derivatives
- No 404/500 documents (commented in `.htaccess`)

Core Web Vitals will be dominated by the Unsplash hero (LCP) and third-party fonts/iframes. The site is “small” but not “optimised”.

---

## 8. Security

| Control | Current state |
| --- | --- |
| HTTPS | Forced in `.htaccess` (depends on Hostinger SSL being active) |
| Headers | `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy` |
| CSP | **Missing** |
| HSTS | **Missing** |
| Permissions-Policy | **Missing** |
| CSRF | Not applicable to static Formspree POST; no same-origin API |
| Secrets | Formspree form ID is public (expected). No `.env`. Mailto address is a placeholder |
| Admin | None |
| Rate limiting | None first-party |
| Input sanitisation | Browser `required` only. Project HTML is string-interpolated in `main.js` (low risk today because data is hardcoded; unsafe if that array ever becomes user-supplied) |
| Session handling | None |
| Dependencies | Website has none. Mobile app has a normal Expo tree |

The site is not “insecure” in the sense of an exposed admin, but it is not hardened for a lead database, file uploads, or authenticated CMS.

---

## 9. Analytics and marketing readiness

| Capability | Current state |
| --- | --- |
| GA4 | Not present |
| GTM | Not present |
| Meta Pixel | Not present |
| Search Console | Verification file present; sitemap not confirmed submitted |
| Conversion events | None |
| UTM capture | None |
| Ads landing pages | None |
| Call tracking | Placeholder `tel:` link |

The site is not advertising-ready.

---

## 10. Accessibility

Partial, not AA.

- Some `aria-label`s on logo and social links
- Form labels exist on both forms
- Design tabs use `role="tab"` / `tabpanel`
- Colour contrast on the blue-on-white UI is likely acceptable; hero white-on-photo is not guaranteed
- No skip link
- No visible focus system beyond browser defaults
- Filter chips are `<button>`s (good) but the project grid has no live-region announcement
- Emoji icons are not meaningful to assistive tech
- `prefers-reduced-motion` is not respected
- No 404 page
- Sticky version badge may interfere with mobile tap targets

---

## 11. Mobile companion app

`mobile-app/` is an Expo / React Native app (Expo 54) with tabs: Home, Projects, Design, About, Contact.

- Duplicates the same placeholder copy, fake stats, and Unsplash images
- Contact details are still `+1 234 567 890`
- Design tab can WebView the Hostinger `design.html`
- Not required for the website rebuild
- **Out of scope** for Phases 1–8 unless later requested
- Risk: if published, it would spread the same unverified claims

---

## 12. Reusable components and ideas

Reuse as **ideas**, not as code:

| Keep the idea | Do not keep |
| --- | --- |
| Project filtering | Fake project dataset and Product/Offer schema |
| Primary + secondary hero CTAs | “Get a Quote” / “Contact Us” as the main language |
| Design-brief capture (budget, timeline, location) | Dark neon UI, broken embeds, mailto handler |
| Sticky header | Corporate blue template styling |
| LocalBusiness JSON-LD *shape* | Placeholder NAP, empty geo, fake SearchAction |
| Instagram URL | Dead social `#` links |
| Logo SVG as interim mark | Claiming it is a finished brand system |
| Hostinger HTTPS / cache header intent | Blocking `/css` and `/js` from crawlers |
| Google verification file awareness | Assuming verification survives a new stack |

Nothing in `css/style.css` or `js/main.js` is worth porting as a component library.

---

## 13. Content worth retaining

**Factual / retain**

- Company name: **SPL Homes** / SPL HOMES
- Instagram: `https://www.instagram.com/spl.homes`
- Public domain currently used in SEO files: `spl-homes.com`
- Google verification filename/token (until re-verified)
- Interim logo/favicon artwork

**Do not retain (unverified or invented)**

- “50+ Projects Delivered”
- “10+ Years Experience”
- “100% On-time Handover (last 12 mo.)”
- “ISO-inspired QA/QC”
- “Licensed professionals” (as a trust line without evidence)
- Project names: Green Meadows Villas, Oak Residence, Skyline Plaza
- Prices (`From $280,000`, Sold Out, etc.)
- US phone, WhatsApp number, “Main Street, City, Country”
- `info@splhomes.com` unless confirmed
- “decades of combined experience”
- `@splhomes` Twitter handle (unverified)
- Hard-coded design-page budget bands as business pricing
- “Free design review” / “Free 20-min consult” unless later approved

**Rewrite completely**

- All body copy. It is generic, slightly US/corporate, and uses clichés (“dream home”).
- Service taxonomy. “General Contracting” and “Structural & Civil Works / RCC” do not match the briefed Wellington residential offer.

---

## 14. Technical debt

1. **Published placeholder business.** Live NAP, stats, and projects are not real. This is a brand and SEO risk.
2. **Single-page IA.** Cannot rank or convert for distinct intents (renovate vs new build vs development).
3. **No lead system.** Enquiries (if any) sit in Formspree, not a pipeline.
4. **Third-party lock-in** for the only working form.
5. **XSS-prone render pattern** in `main.js` if data is ever externalised.
6. **Crawler-hostile robots.txt.**
7. **Invalid sitemap entries.**
8. **Schema that over-claims** (Product/Offer, SearchAction, empty geo).
9. **Missing legal pages.**
10. **Design page is a separate visual product** with broken embeds.
11. **No environments.** One set of files = production.
12. **No tests.**
13. **Duplicate content** across web and Expo app.
14. **No owned media pipeline.**
15. **Shared hosting ceiling.** Static Apache hosting cannot support the required admin, planner, and database.

---

## 15. Competitive principles observed (not to copy)

Studied for *principles only* — branding, copy, layout, and assets were not copied.

**G.J. Gardner Homes**

- Immediate intent capture (“I would like to…”)
- Heavy trust messaging (used by a franchise; SPL should not imitate awards or “most trusted” claims)
- Downloadable guide as a lead magnet
- Clear “talk to local team” geographic framing
- Building-journey education

**Friday Homes**

- Multiple entry points: Design + Build, House + Land, Subdivide + Develop
- Process clarity with cost checkpoints
- Strong Wellington / regional locality
- House-plan exploration and “price this plan”
- Transparency language (without SPL inventing equivalent guarantees)
- Dedicated process page that reduces uncertainty

**HBC Homes**

- Simple local builder positioning
- Service split: new builds, renovations/extensions, commercial/fit-out
- Suburb-level Wellington targeting in the header
- Short, understandable process
- Low-friction contact

**SPL Homes implication:** combine Friday-like IA and intent paths, G.J.-like conversion mechanics (planner + guide + trust *placeholders*), and HBC-like local simplicity — with a more personal, non-franchise tone.

---

## 16. Hosting implication

| Environment | Fits current Hostinger shared plan? |
| --- | --- |
| Keep today’s brochure online | Yes |
| Next.js SSR, admin, Prisma, MySQL | **Yes, as a new Node.js Web App** — do not replace the live brochure slot |
| Static export of a marketing shell only | Possible, but would drop admin, planner persistence, and image pipelines |

**Do not** upload a new stack into `public_html` of the live site. **Do not** change DNS as part of this rebuild.

---

## 17. Audit conclusion

The repository is a **Hostinger-ready static prototype** with incomplete SEO, placeholder identity, and no conversion system. A small number of artefacts (logo, Instagram, domain, GSC file, the *idea* of a design brief) are useful. Almost all public content must be replaced or clearly labelled as a placeholder.

The rebuild should live beside this site, not on top of it, until staging is signed off.
