const base = (process.env.SMOKE_BASE_URL || "").replace(/\/$/, "");
const mode = process.env.SMOKE_MODE || "staging";

if (!base) {
  console.error("SMOKE_BASE_URL is required");
  process.exit(1);
}

const pages = [
  "/",
  "/services",
  "/projects",
  "/process",
  "/about",
  "/insights",
  "/contact",
  "/start-your-project",
  "/robots.txt",
  "/sitemap.xml",
];

async function fetchOk(path, options = {}) {
  const url = `${base}${path}`;
  const response = await fetch(url, { redirect: "follow", ...options });
  return { url, response, text: await response.text() };
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const robots = await fetchOk("/robots.txt");
if (!robots.response.ok) fail(`${robots.url} returned ${robots.response.status}`);

if (mode === "staging") {
  if (!/Disallow:\s*\//i.test(robots.text)) {
    fail("Staging robots.txt must contain Disallow: /");
  }
  const robotsTag = robots.response.headers.get("x-robots-tag") || "";
  if (!/noindex,\s*nofollow/i.test(robotsTag)) {
    fail("Staging must send X-Robots-Tag: noindex, nofollow");
  }
} else {
  if (/Disallow:\s*\/\s*$/m.test(robots.text) && !/Allow:\s*\//i.test(robots.text)) {
    fail("Production robots.txt must not disallow the whole site");
  }
}

const sitemap = await fetchOk("/sitemap.xml");
if (mode === "staging") {
  if (/https:\/\/(www\.)?splhomes\.co\.nz(?![\w.-])/i.test(sitemap.text)) {
    fail("Staging sitemap advertised public production URLs");
  }
  const home = await fetchOk("/");
  if (/rel="canonical" href="https:\/\/(www\.)?splhomes\.co\.nz/i.test(home.text)) {
    fail("Staging homepage used a production canonical");
  }
  if (/"@type":"HomeAndConstructionBusiness"[\s\S]*"url":"https:\/\/(www\.)?splhomes\.co\.nz/i.test(home.text)) {
    fail("Staging schema used the production site URL");
  }
}

for (const path of pages) {
  const { url, response } = await fetchOk(path);
  if (!response.ok) fail(`${url} returned ${response.status}`);
  else console.log(`ok ${response.status} ${path}`);
}

const missing = await fetchOk("/this-page-does-not-exist-spl-ci");
if (missing.response.status !== 404) {
  fail(`Expected 404 for missing page, received ${missing.response.status}`);
} else {
  console.log("ok 404 /this-page-does-not-exist-spl-ci");
}

if (mode === "production") {
  const home = await fetchOk("/");
  if (!home.text.includes("splhomes.co.nz") && !home.text.includes(new URL(base).host)) {
    fail("Production homepage did not include the expected host");
  }
  const canonical = home.text.match(/rel="canonical" href="([^"]+)"/);
  if (canonical && !canonical[1].startsWith(base)) {
    fail(`Production canonical ${canonical[1]} does not match ${base}`);
  }
}

const lead = await fetchOk("/api/leads", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    ...(process.env.CI_LEAD_MARKER ? { "x-ci-lead-marker": process.env.CI_LEAD_MARKER } : {}),
  },
  body: JSON.stringify({
    source: "contact",
    name: "CI Smoke Test",
    email: "ci-smoke@example.com",
    phone: "0200000000",
    project_type: "unsure",
    message: "Automated smoke test. Safe to archive.",
    consent: true,
    company: mode === "production" ? "honeypot" : "",
  }),
});

if (!lead.response.ok) {
  fail(`Lead submission failed: ${lead.response.status} ${lead.text}`);
} else {
  console.log(`ok lead ${lead.response.status}`);
}

if (process.exitCode) {
  console.error("Smoke tests failed");
  process.exit(process.exitCode);
}

console.log(`Smoke tests passed against ${base} (${mode})`);
