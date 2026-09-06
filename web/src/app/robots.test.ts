import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { robotsRules, robotsTxtBody } from "../lib/seo-routes.ts";
import { GET } from "./robots.txt/route.ts";

describe("robots", () => {
  const previous = { ...process.env };

  afterEach(() => {
    process.env = { ...previous };
  });

  it("disallows the whole site when noindex is on", () => {
    assert.deepEqual(robotsRules(true), { userAgent: "*", disallow: "/" });
  });

  it("allows public pages in production and blocks admin", () => {
    const result = robotsRules(false);
    assert.equal(result.allow, "/");
    assert.deepEqual(result.disallow, ["/admin", "/api"]);
  });

  it("returns a staging robots.txt body and X-Robots-Tag header", async () => {
    process.env.APP_ENV = "staging";
    process.env.NOINDEX = "true";
    const response = GET();
    const body = await response.text();
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /text\/plain/);
    assert.match(body, /User-Agent:\s*\*/i);
    assert.match(body, /Disallow:\s*\/\s*$/m);
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  });

  it("preserves production robots policy without a noindex header", async () => {
    process.env.APP_ENV = "production";
    process.env.NOINDEX = "false";
    const response = GET();
    const body = await response.text();
    const expected = robotsTxtBody(false, "https://example.test");
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-robots-tag"), null);
    assert.match(body, /User-Agent:\s*\*/i);
    assert.match(body, /Allow:\s*\//);
    assert.match(body, /Disallow:\s*\/admin/);
    assert.match(body, /Disallow:\s*\/api/);
    assert.match(body, /Sitemap:\s+\S+\/sitemap\.xml/);
    assert.doesNotMatch(body, /^Disallow:\s*\/\s*$/m);
    assert.match(expected, /Allow:\s*\//);
    assert.match(expected, /Disallow:\s*\/admin/);
    assert.match(expected, /Disallow:\s*\/api/);
    assert.match(expected, /Sitemap:\s+https:\/\/example\.test\/sitemap\.xml/);
  });
});
