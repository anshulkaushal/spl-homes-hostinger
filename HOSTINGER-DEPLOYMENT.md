# HOSTINGER-DEPLOYMENT

Panel and environment notes. **CI/CD, secrets, rollback and smoke tests live in [DEPLOYMENT.md](./DEPLOYMENT.md).**

**Target:** Hostinger Business Web Hosting — managed Node.js Web App  
**App directory in git:** `web` (the deploy archive is the contents of `web/`)  
**Node:** 22 LTS  
**Database:** Hostinger MySQL via Prisma  
**Production domain (later):** `https://splhomes.co.nz`  
**Staging domain:** `https://staging.splhomes.co.nz` or a Hostinger temporary domain

The live brochure stays online. Create a **new** Node.js web app for staging. Do not attach Actions to the current production website.

Turn off Hostinger Git auto-deploy on that app. GitHub Actions is the deployment trigger.
