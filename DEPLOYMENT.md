# DEPLOYMENT

**Application:** `/web` (Next.js, Node.js 22)  
**Host:** Hostinger Business Web Hosting — managed Node.js  
**Database:** Hostinger MySQL via Prisma  
**Control plane:** GitHub Actions  
**Hostinger build plane:** official Hostinger Hosting API

This is the deployment contract. Production cutover still requires a human go-ahead. Do not change DNS or replace the live brochure from these workflows until that approval exists.

---

## Deployment invariants

1. Hostinger Git auto-deploy must remain disabled.
2. GitHub Actions is the only permitted release trigger.
3. Production deployment is manual only.
4. Production requires GitHub Environment approval.
5. The exact CI-tested Git SHA must be deployed.
6. Staging and production use separate Hostinger application/environment configuration.
7. Secrets must never be copied between environments unless intentionally identical.
8. A failed Hostinger build or failed smoke test means deployment failure.
9. Synthetic CI leads must never be treated as real customer leads.
10. Rollback means redeploying a previously known-good Git SHA.

---

## Chosen Hostinger method

Hostinger documents three Node.js sources: GitHub App auto-deploy, archive upload, and the Hostinger Connector.

**We do not rely solely on Hostinger Git auto-deploy.**

The official path for external CI/CD is **archive + Hostinger Node.js build API**:

1. GitHub Actions runs CI (lint, typecheck, tests, `next build`).
2. Actions packages the `web/` source (no `node_modules`, no `.next`).
3. Actions calls Hostinger’s documented API:
   - Preferred: `POST /api/hosting/v1/accounts/{username}/websites/{domain}/nodejs/builds/from-archive`
   - Fallback (also official): generate an upload URL, `PUT` the archive, then `POST .../nodejs/builds` with `source_type: archive`
4. Hostinger installs dependencies, runs `npm run build`, and starts `npm start` on Node 22.
5. Actions polls build state. Failure fails the workflow.
6. Actions runs smoke tests against the deployed URL. Failure fails the workflow.

References:

- [Creating a Node.js App — programmatic deploys](https://docs.hostinger.com/node.js/creating-an-app)
- [GitHub vs archive (“external CI/CD”)](https://docs.hostinger.com/node.js/github)
- [Hostinger API](https://developers.hostinger.com/) — Bearer token from hPanel → API
- [Start Node.js build](https://github.com/hostinger/api-php-sdk/blob/main/docs/Api/HostingNodeJSApi.md)

Do not invent SFTP/rsync deploys of a prebuilt `.next` folder unless Hostinger’s API is unavailable. The Node.js Web App is supposed to build on Hostinger.

Turn **off** Hostinger Git auto-deploy on the staging and production Node apps so a push cannot race GitHub Actions.

---

## Workflows

| File | Trigger | Purpose |
| --- | --- | --- |
| `.github/workflows/ci.yml` | Pull requests, pushes to `main` / `develop`, reusable | `npm ci`, lint, typecheck, unit tests, `npm audit`, production `next build` |
| `.github/workflows/deploy-staging.yml` | Push to `staging`, or `workflow_dispatch` | CI → Hostinger staging → smoke tests |
| `.github/workflows/deploy-production.yml` | `workflow_dispatch` only | Confirmation + CI → Hostinger production → smoke tests |

Production never deploys from a normal push.

---

## GitHub Environments

Create these in the GitHub repo: **Settings → Environments**.

### `splhomes-staging`

- Deployment branches: `staging` (and allow `workflow_dispatch`)
- Optional wait timer: none

**Secrets**

| Secret | Purpose |
| --- | --- |
| `HOSTINGER_API_TOKEN` | hPanel → API token |
| `HOSTINGER_USERNAME` | Hosting account username (`u123456789`) |
| `HOSTINGER_DOMAIN` | Staging hostname, e.g. `staging.splhomes.co.nz` |
| `STAGING_URL` | `https://staging.splhomes.co.nz` (or a Hostinger temporary domain) |

**Variables (preferred for the public URL)**

| Variable | Example |
| --- | --- |
| `STAGING_URL` | `https://staging.splhomes.co.nz` |

### `splhomes-production`

- Required reviewers: at least one person
- Prevent self-approval if the team has more than one admin
- Deployment branches: `main` only (plus explicit SHAs via `workflow_dispatch`)

**Secrets**

| Secret | Purpose |
| --- | --- |
| `HOSTINGER_API_TOKEN` | Production-capable token (or the same token with website scope) |
| `HOSTINGER_USERNAME` | Hosting account username |
| `HOSTINGER_DOMAIN` | Production Node app hostname — **not** until cutover is approved |
| `PRODUCTION_URL` | `https://splhomes.co.nz` when that app exists |

Do not put the live brochure domain here while the old site is still the public site.

Never store database passwords, analytics IDs, or SMTP credentials in the workflow files. Those belong in **Hostinger Web App environment variables**, not in GitHub, except the API token needed to trigger a build.

---

## Hostinger Web App configuration

Create a **new** Node.js web app for staging. Do not attach it to the current live website.

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Node.js | **22** |
| Application directory | contents of `web/` (archive root = `package.json`) |
| Build command | `npm run build` (`prisma generate && next build`) |
| Start command | `npm start` (`next start`) |
| Output directory | `.next` |
| Package manager | npm |

Hostinger sets `PORT`. `next start` reads it.

### Hostinger environment variables (staging)

```
APP_ENV=staging
SITE_URL=https://staging.splhomes.co.nz
NOINDEX=true
USE_MYSQL=true
DATABASE_URL=mysql://USER:PASSWORD@MYSQL_HOSTNAME:3306/STAGING_DB
ADMIN_PASSWORD=...
NEXT_PUBLIC_PHONE=
NEXT_PUBLIC_EMAIL=
NEXT_PUBLIC_ADDRESS=
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

`DATABASE_URL` must use the Remote MySQL hostname, not `localhost`.

### Hostinger environment variables (production — later only)

```
APP_ENV=production
SITE_URL=https://splhomes.co.nz
NOINDEX=false
USE_MYSQL=true
DATABASE_URL=mysql://...production...
```

Plus real NAP and tracking IDs when supplied.

Prisma: run `npx prisma migrate deploy` against **staging** MySQL from a trusted machine before the first staging deploy that needs tables. Do not migrate production until cutover.

---

## Staging deployment

1. Push to `staging`, or run **Deploy staging** in Actions.
2. CI must pass, including the production Next.js build.
3. The archive is uploaded to Hostinger; Hostinger builds and restarts the app.
4. Smoke tests hit:

   `/` `/services` `/projects` `/start-your-project` `/contact` `/robots.txt` `/sitemap.xml` and a 404 URL.

5. Staging must return `Disallow: /` and `X-Robots-Tag: noindex`.
6. A test enquiry is posted to `/api/leads`. If that fails, the workflow fails.

---

## Production deployment

1. In Actions, run **Deploy production**.
2. Type `deploy-production` in the confirm field.
3. Choose a git ref (`main` or a known-good SHA).
4. A required GitHub Environment reviewer must approve.
5. CI runs again on that ref. A failed build stops the deploy.
6. Hostinger builds the production Node app.
7. Smoke tests run. On failure the workflow is **failed** — it does not continue.

Until cutover is approved, do not create or attach a production Node app to `splhomes.co.nz`.

---

## Rollback

Hostinger’s start-build call overwrites the running app. Recovery is **redeploy a previous git commit**, not an in-place undo.

1. Find the last known-good SHA (Actions history or `git log`).
2. Open **Deploy production** (or staging).
3. Set `ref` to that SHA.
4. Confirm and get the environment approval.
5. CI + Hostinger build + smoke tests run on that exact tree.

Each successful deploy also stores `spl-homes-web-<sha>.zip` as a GitHub Actions artefact (90 days). That zip is the same source Hostinger built. Keep the git tag / SHA; do not delete the repo history.

Never force-push over a released SHA. Never delete the Hostinger website to “fix” a bad deploy.

Optional extra safety: after a good production deploy, tag `release-YYYYMMDD-HHMM-<sha>`.

---

## Troubleshooting

| Symptom | Check |
| --- | --- |
| CI fails on `prisma generate` | `DATABASE_URL` dummy is set in the workflow; `USE_MYSQL=false` |
| CI fails `npm audit` | Fix or bump the vulnerable package; do not `--force` in the workflow |
| `from-archive` 401 | Token from hPanel → API; secret name `HOSTINGER_API_TOKEN` |
| `from-archive` 404 | Domain and username must match the Node.js Web App, not the old static site |
| Build completed, site old | Runtime logs; confirm the Node process restarted |
| Smoke 404 on real pages | Hostinger root/output settings; app must be Next.js SSR, not static export |
| Staging indexed | `NOINDEX=true`, `APP_ENV=staging`, check `robots.txt` and `X-Robots-Tag` |
| Lead POST 500 | Staging MySQL + `USE_MYSQL=true` + migrations |
| Two deploys at once | Disable Hostinger Git auto-deploy |

---

## What we are not using

Vercel, Netlify, AWS Lambda, Azure Functions, Kubernetes, Docker orchestration, Hostinger VPS/PM2, invented SFTP sync of `.next`, or Hostinger Git auto-deploy as the only control.

See also `HOSTINGER-DEPLOYMENT.md` for panel-first notes and `IMPLEMENTATION-PLAN.md` Phase 8.