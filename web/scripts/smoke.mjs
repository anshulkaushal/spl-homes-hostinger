import path from "node:path";
import { fileURLToPath } from "node:url";
import { redactSecrets } from "./hostinger-deploy.mjs";

const BODY_SNIPPET_LIMIT = 240;

export function escapeWorkflowCommand(value) {
  return String(value ?? "")
    .replace(/%/g, "%25")
    .replace(/\r/g, "%0D")
    .replace(/\n/g, "%0A");
}

export function smokeBodySnippet(text, limit = BODY_SNIPPET_LIMIT) {
  const compact = redactSecrets(String(text ?? "").replace(/\s+/g, " ").trim()).replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    "***",
  );
  return compact.slice(0, limit);
}

export function formatSmokeFailure({ path: requestPath, expected, status, headerName, header, body }) {
  const lines = [
    "Smoke assertion failed",
    requestPath ? `path: ${requestPath}` : null,
    expected ? `expected: ${expected}` : null,
    status != null ? `status: ${status}` : null,
    headerName ? `${headerName}: ${header ? redactSecrets(header) : "(missing)"}` : null,
    body != null && body !== "" ? `body: ${smokeBodySnippet(body)}` : null,
  ];
  return redactSecrets(lines.filter(Boolean).join("\n"));
}

export function githubErrorAnnotation({ title, message }) {
  const safeTitle = escapeWorkflowCommand(title).replace(/,/g, "%2C");
  return `::error file=web/scripts/smoke.mjs,title=${safeTitle}::${escapeWorkflowCommand(message)}`;
}

export function emitSmokeFailure(details) {
  const report = formatSmokeFailure(details);
  const title = `Smoke ${details.path || "test"}`.trim();
  console.error(report);
  console.log(githubErrorAnnotation({ title, message: report }));
}

function fail(expected, details = {}) {
  emitSmokeFailure({ expected, ...details });
  process.exitCode = 1;
}

async function fetchOk(base, requestPath, options = {}) {
  const url = `${base}${requestPath}`;
  const response = await fetch(url, { redirect: "follow", ...options });
  return { url, response, text: await response.text() };
}

// Hostinger's hcdn front proxy serves /robots.txt on *.hostingersite.com
// temporary hostnames before the request reaches Next.js. Live evidence:
// Server: hcdn, no x-powered-by / x-nextjs / x-robots-tag, and a
// Googlebot-only Disallow policy. Application pages still come from Next
// and must keep X-Robots-Tag: noindex, nofollow.
export function isHostingerTemporaryHostname(hostname) {
  return /(^|\.)hostingersite\.com$/i.test(String(hostname || ""));
}

export function robotsTxtBlocksGooglebot(body) {
  const group = String(body ?? "").match(/User-agent:\s*Googlebot\b(.*?)(?=User-agent:|$)/is);
  return Boolean(group && /Disallow:\s*\/\s*$/m.test(group[1]));
}

export function hasNoindexNofollow(header) {
  return /noindex,\s*nofollow/i.test(String(header || ""));
}

export function evaluateStagingHomeRobotsTag(header) {
  if (hasNoindexNofollow(header)) {
    return { ok: true, expected: "X-Robots-Tag: noindex, nofollow" };
  }
  return {
    ok: false,
    expected: "Staging / must send X-Robots-Tag: noindex, nofollow",
  };
}

export function evaluateStagingRobotsTxt({ hostname, status, body, robotsTag }) {
  if (status !== 200) {
    return { ok: false, expected: "HTTP 200 for /robots.txt" };
  }

  if (isHostingerTemporaryHostname(hostname)) {
    if (!robotsTxtBlocksGooglebot(body)) {
      return {
        ok: false,
        expected:
          "Hostinger temporary-domain /robots.txt must block Googlebot with Disallow: /",
      };
    }
    return {
      ok: true,
      expected:
        "Hostinger temporary-domain robots: Googlebot Disallow: / (X-Robots-Tag not required; hcdn serves this file)",
    };
  }

  if (!/Disallow:\s*\//i.test(String(body ?? ""))) {
    return { ok: false, expected: "Staging robots.txt must contain Disallow: /" };
  }
  if (!hasNoindexNofollow(robotsTag)) {
    return {
      ok: false,
      expected: "Staging must send X-Robots-Tag: noindex, nofollow",
    };
  }
  return {
    ok: true,
    expected: "Application-owned staging robots: Disallow: / and X-Robots-Tag",
  };
}

export async function runSmoke(env = process.env) {
  const base = (env.SMOKE_BASE_URL || "").replace(/\/$/, "");
  const mode = env.SMOKE_MODE || "staging";

  if (!base) {
    fail("SMOKE_BASE_URL is required");
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

  const robots = await fetchOk(base, "/robots.txt");
  const hostname = new URL(base).hostname;
  if (mode === "staging") {
    const robotsCheck = evaluateStagingRobotsTxt({
      hostname,
      status: robots.response.status,
      body: robots.text,
      robotsTag: robots.response.headers.get("x-robots-tag") || "",
    });
    if (!robotsCheck.ok) {
      fail(robotsCheck.expected, {
        path: "/robots.txt",
        status: robots.response.status,
        headerName: isHostingerTemporaryHostname(hostname) ? undefined : "X-Robots-Tag",
        header: robots.response.headers.get("x-robots-tag") || "",
        body: robots.text,
      });
    }
  } else if (!robots.response.ok) {
    fail(`${robots.url} returned ${robots.response.status}`, {
      path: "/robots.txt",
      status: robots.response.status,
      body: robots.text,
    });
  } else if (/Disallow:\s*\/\s*$/m.test(robots.text) && !/Allow:\s*\//i.test(robots.text)) {
    fail("Production robots.txt must not disallow the whole site", {
      path: "/robots.txt",
      status: robots.response.status,
      body: robots.text,
    });
  }

  const sitemap = await fetchOk(base, "/sitemap.xml");
  if (mode === "staging") {
    if (/https:\/\/(www\.)?splhomes\.co\.nz(?![\w.-])/i.test(sitemap.text)) {
      fail("Staging sitemap advertised public production URLs", {
        path: "/sitemap.xml",
        status: sitemap.response.status,
        body: sitemap.text,
      });
    }
    const home = await fetchOk(base, "/");
    const homeTag = evaluateStagingHomeRobotsTag(home.response.headers.get("x-robots-tag") || "");
    if (!homeTag.ok) {
      fail(homeTag.expected, {
        path: "/",
        status: home.response.status,
        headerName: "X-Robots-Tag",
        header: home.response.headers.get("x-robots-tag") || "",
      });
    }
    if (/rel="canonical" href="https:\/\/(www\.)?splhomes\.co\.nz/i.test(home.text)) {
      fail("Staging homepage used a production canonical", {
        path: "/",
        status: home.response.status,
        body: home.text,
      });
    }
    if (/"@type":"HomeAndConstructionBusiness"[\s\S]*"url":"https:\/\/(www\.)?splhomes\.co\.nz/i.test(home.text)) {
      fail("Staging schema used the production site URL", {
        path: "/",
        status: home.response.status,
        body: home.text,
      });
    }
  }

  for (const requestPath of pages) {
    const { url, response, text } = await fetchOk(base, requestPath);
    if (!response.ok) {
      fail(`${url} returned ${response.status}`, {
        path: requestPath,
        status: response.status,
        body: text,
      });
    } else {
      console.log(`ok ${response.status} ${requestPath}`);
    }
  }

  const missing = await fetchOk(base, "/this-page-does-not-exist-spl-ci");
  if (missing.response.status !== 404) {
    fail(`Expected 404 for missing page, received ${missing.response.status}`, {
      path: "/this-page-does-not-exist-spl-ci",
      status: missing.response.status,
      body: missing.text,
    });
  } else {
    console.log("ok 404 /this-page-does-not-exist-spl-ci");
  }

  if (mode === "production") {
    const home = await fetchOk(base, "/");
    if (!home.text.includes("splhomes.co.nz") && !home.text.includes(new URL(base).host)) {
      fail("Production homepage did not include the expected host", {
        path: "/",
        status: home.response.status,
        body: home.text,
      });
    }
    const canonical = home.text.match(/rel="canonical" href="([^"]+)"/);
    if (canonical && !canonical[1].startsWith(base)) {
      fail(`Production canonical ${canonical[1]} does not match ${base}`, {
        path: "/",
        status: home.response.status,
        body: home.text,
      });
    }
  }

  const lead = await fetchOk(base, "/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(env.CI_LEAD_MARKER ? { "x-ci-lead-marker": env.CI_LEAD_MARKER } : {}),
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
    fail("Lead submission failed", {
      path: "/api/leads",
      status: lead.response.status,
      body: lead.text,
    });
  } else {
    console.log(`ok lead ${lead.response.status}`);
  }

  if (process.exitCode) {
    console.error("Smoke tests failed");
    process.exit(process.exitCode);
  }

  console.log(`Smoke tests passed against ${base} (${mode})`);
}

function isDirectRun() {
  const invoked = process.argv[1] && path.resolve(process.argv[1]);
  if (!invoked) return false;
  return path.normalize(fileURLToPath(import.meta.url)).toLowerCase() === path.normalize(invoked).toLowerCase();
}

if (isDirectRun()) {
  runSmoke().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
