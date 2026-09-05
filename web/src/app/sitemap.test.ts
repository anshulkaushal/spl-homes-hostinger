import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { coreSitemapPaths } from "../lib/seo-routes.ts";

describe("sitemap", () => {
  it("includes core conversion routes and no admin", () => {
    assert.ok(coreSitemapPaths.includes("/"));
    assert.ok(coreSitemapPaths.includes("/start-your-project"));
    assert.ok(coreSitemapPaths.includes("/projects"));
    assert.ok(coreSitemapPaths.includes("/contact"));
    assert.ok(!coreSitemapPaths.some((path) => path.includes("/admin")));
  });
});
