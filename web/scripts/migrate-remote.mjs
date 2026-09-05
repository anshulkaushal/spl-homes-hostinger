import { spawnSync } from "node:child_process";

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

const looksProduction =
  /prod/i.test(database) ||
  /production/i.test(host) ||
  database === "spl_homes" ||
  database === "splhomes";

if (looksProduction) {
  console.error("Refusing to migrate a database that looks like production.");
  process.exit(1);
}

const looksStaging = /stag/i.test(database) || /stag/i.test(host);
if (!looksStaging && process.env.ALLOW_NONSTAGING_NAME !== "true") {
  console.error(
    "Database host/name does not look like staging. Set ALLOW_NONSTAGING_NAME=true only after confirming the target.",
  );
  process.exit(1);
}

const status = spawnSync("npx", ["prisma", "migrate", "status"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (status.status !== 0) {
  process.exit(status.status ?? 1);
}

const deploy = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(deploy.status ?? 1);
