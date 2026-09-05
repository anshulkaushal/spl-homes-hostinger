import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { robotsRules } from "../lib/seo-routes.ts";

describe("robots", () => {
  it("disallows the whole site when noindex is on", () => {
    assert.deepEqual(robotsRules(true), { userAgent: "*", disallow: "/" });
  });

  it("allows public pages in production and blocks admin", () => {
    const result = robotsRules(false);
    assert.equal(result.allow, "/");
    assert.deepEqual(result.disallow, ["/admin", "/api"]);
  });
});
