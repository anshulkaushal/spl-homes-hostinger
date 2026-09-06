# HOSTINGER-DEPLOYMENT

Panel and environment notes. **CI/CD, secrets, rollback and smoke tests live in [DEPLOYMENT.md](./DEPLOYMENT.md).**

**Target:** Hostinger Business Web Hosting — managed Node.js Web App  
**App directory in git:** `web` (the deploy archive is the contents of `web/`)  
**Node:** 22 LTS  
**Database:** Hostinger MySQL via Prisma  
**Production:** `https://spl-homes.com`  
**Staging:** `https://staging.splhomes.co.nz` or the Hostinger temporary staging hostname already in use

Turn off Hostinger Git auto-deploy on the staging and production Node apps. GitHub Actions is the deployment trigger.

## MySQL

Production database/user **keep**: `u182465577_splhomes_prod`.

| Client | Host:port |
| --- | --- |
| Production Hostinger Web App build and runtime | `localhost:3306` |
| External tools such as MySQL Workbench | `srv1518.hstgr.io:3306` |

The production app does not need Remote MySQL. A temporary Remote MySQL rule used for Workbench can be removed after launch verification; that does not affect the `localhost` production connection.

Do not change the working staging `DATABASE_URL` to match production. Do not create another production database. Do not delete `u182465577_splhomes_prod`.
