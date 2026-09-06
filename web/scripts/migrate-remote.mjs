import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { assertDatabaseTargetForEnv } from "./db-target.mjs";

const url = process.env.DATABASE_URL;
const appEnv = process.env.APP_ENV;

if (!url) {
  if (appEnv === "staging" || appEnv === "production") {
    console.error("DATABASE_URL is required for migrate:deploy in staging/production.");
    process.exit(1);
  }
  console.log("Skipping Prisma migrate deploy: DATABASE_URL is not set.");
  process.exit(0);
}

let parsed;
try {
  parsed = new URL(url);
} catch {
  console.error("DATABASE_URL is not a valid URL");
  process.exit(1);
}

const host = parsed.hostname;
const database = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
const maskedHost =
  host.length <= 6 ? "***" : `${host.slice(0, 2)}***${host.slice(-4)}`;

console.log(`Prisma target env=${appEnv || "(unset)"} host=${maskedHost} database=${database}`);

const target = assertDatabaseTargetForEnv(appEnv, database, host);
if (!target.ok) {
  const messages = {
    "unknown-env": "Refusing to migrate: APP_ENV must be staging or production.",
    "not-spl-homes": "Refusing to migrate a database that is not an SPL Homes target.",
    production: "Refusing to migrate a production database from staging.",
    staging: "Refusing to migrate a staging database from production.",
    "not-staging": "Refusing to migrate: SPL Homes staging database name is required.",
    "not-production": "Refusing to migrate: SPL Homes production database name is required.",
  };
  console.error(messages[target.reason] || `Refusing to migrate: ${target.reason}`);
  process.exit(1);
}

if (!existsSync("node_modules/prisma")) {
  console.error("Pinned Prisma CLI is not installed. Run npm ci in web/ first.");
  process.exit(1);
}

function runPrisma(args) {
  return spawnSync("npm", ["exec", "--", "prisma", ...args], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}

// `prisma migrate status` exits non-zero when migrations are pending.
// Deploy first so pending migrations are applied instead of aborting the build.
const deploy = runPrisma(["migrate", "deploy"]);
if (deploy.status !== 0) {
  process.exit(deploy.status ?? 1);
}

const status = runPrisma(["migrate", "status"]);
process.exit(status.status ?? 1);
