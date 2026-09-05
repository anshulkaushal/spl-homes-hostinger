import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isPublicProductionUrl, resolveSiteUrl } from "./site-url.ts";

describe("site URL resolution", () => {
  it("prefers SITE_URL then NEXT_PUBLIC_SITE_URL", () => {
    assert.equal(resolveSiteUrl({ SITE_URL: "https://staging.example.test/" }), "https://staging.example.test");
    assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://staging.example.test" }), "https://staging.example.test");
  });

  it("does not fall back to production on staging", () => {
    assert.equal(resolveSiteUrl({ APP_ENV: "staging" }), "https://staging.splhomes.co.nz");
    assert.equal(isPublicProductionUrl(resolveSiteUrl({ APP_ENV: "staging" })), false);
  });

  it("identifies only the public production hosts", () => {
    assert.equal(isPublicProductionUrl("https://splhomes.co.nz/"), true);
    assert.equal(isPublicProductionUrl("https://www.splhomes.co.nz/projects"), true);
    assert.equal(isPublicProductionUrl("https://staging.splhomes.co.nz/"), false);
  });
});
