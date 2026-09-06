import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { shouldNoindex } from "./env-flags.ts";
import {
  X_ROBOTS_TAG_VALUE,
  shouldApplyXRobotsTagPath,
  xRobotsTagHeader,
} from "./robots-tag.ts";

describe("X-Robots-Tag header rule", () => {
  const previous = { ...process.env };

  afterEach(() => {
    process.env = { ...previous };
  });

  it("sets noindex, nofollow in staging and NOINDEX mode", () => {
    process.env.APP_ENV = "staging";
    process.env.NOINDEX = "false";
    assert.deepEqual(xRobotsTagHeader(shouldNoindex()), {
      key: "X-Robots-Tag",
      value: X_ROBOTS_TAG_VALUE,
    });

    process.env.APP_ENV = "local";
    process.env.NOINDEX = "true";
    assert.deepEqual(xRobotsTagHeader(shouldNoindex()), {
      key: "X-Robots-Tag",
      value: "noindex, nofollow",
    });
  });

  it("does not set the header in production without noindex", () => {
    process.env.APP_ENV = "production";
    process.env.NOINDEX = "false";
    assert.equal(shouldNoindex(), false);
    assert.equal(xRobotsTagHeader(shouldNoindex()), null);
  });

  it("covers /robots.txt and other responses except Next static assets", () => {
    assert.equal(shouldApplyXRobotsTagPath("/robots.txt"), true);
    assert.equal(shouldApplyXRobotsTagPath("/"), true);
    assert.equal(shouldApplyXRobotsTagPath("/contact"), true);
    assert.equal(shouldApplyXRobotsTagPath("/_next/static/chunk.js"), false);
  });
});
