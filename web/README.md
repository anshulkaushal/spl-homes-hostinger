# SPL Homes website

This is the new SPL Homes site: a conversion-focused Next.js application for Wellington building leads.

**Runtime:** Node.js 22  
**Database:** Hostinger MySQL + Prisma (local file store until `USE_MYSQL=true`)  
**Hosting:** Hostinger Business Node.js Web App — see `../HOSTINGER-DEPLOYMENT.md`

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local`. Set `ADMIN_PASSWORD` to review enquiries at `/admin`.

Without a local MySQL server, leave `USE_MYSQL=false`. Leads write to `data/leads.json`.

Do not deploy this over the live production website. Staging first. Production cutover requires explicit approval.
