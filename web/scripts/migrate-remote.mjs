import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { assertStagingDatabaseTarget } from "./db-target.mjs";

const url = process.env.DATABASE_URL;

if (!url) {
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

console.log(`Prisma target host=${maskedHost} database=${database}`);

const target = assertStagingDatabaseTarget(database, host);
if (target.reason === "production") {
  console.error("Refusing to migrate a database that looks like production.");
  process.exit(1);
}
if (
  target.reason === "not-staging" &&
  process.env.ALLOW_NONSTAGING_NAME !== "true"
) {
  console.error(
    "Database host/name does not look like staging. Set ALLOW_NONSTAGING_NAME=true only after confirming the target.",
  );
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

const status = runPrisma(["migrate", "status"]);
if (status.status !== 0) {
  process.exit(status.status ?? 1);
}

const deploy = runPrisma(["migrate", "deploy"]);
process.exit(deploy.status ?? 1);
