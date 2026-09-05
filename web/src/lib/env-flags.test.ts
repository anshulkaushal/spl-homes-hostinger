import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { isProduction, shouldNoindex } from "./env-flags.ts";

describe("environment flags", () => {
  const previous = { ...process.env };

  afterEach(() => {
    process.env = { ...previous };
  });

  it("noindexes staging", () => {
    process.env.APP_ENV = "staging";
    process.env.NOINDEX = "false";
    assert.equal(shouldNoindex(), true);
    assert.equal(isProduction(), false);
  });

  it("noindexes when NOINDEX is true", () => {
    process.env.APP_ENV = "local";
    process.env.NOINDEX = "true";
    assert.equal(shouldNoindex(), true);
  });

  it("allows production indexing", () => {
    process.env.APP_ENV = "production";
    process.env.NOINDEX = "false";
    assert.equal(shouldNoindex(), false);
    assert.equal(isProduction(), true);
  });
});
