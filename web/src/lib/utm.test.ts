import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mergeAttribution, parseAttributionParams } from "./utm.ts";

describe("UTM capture", () => {
  it("reads utm params and click ids from a landing URL", () => {
    const touch = parseAttributionParams(
      "?utm_source=google&utm_medium=cpc&utm_campaign=new-homes&gclid=G123&fbclid=F9",
      "/services/new-homes",
    );
    assert.equal(touch.utm_source, "google");
    assert.equal(touch.utm_medium, "cpc");
    assert.equal(touch.utm_campaign, "new-homes");
    assert.equal(touch.gclid, "G123");
    assert.equal(touch.fbclid, "F9");
    assert.equal(touch.landing_page, "/services/new-homes?utm_source=google&utm_medium=cpc&utm_campaign=new-homes&gclid=G123&fbclid=F9");
  });

  it("keeps first-touch values when a later landing arrives", () => {
    const first = parseAttributionParams("?utm_source=google", "/");
    const last = parseAttributionParams("?utm_source=facebook", "/projects");
    const merged = mergeAttribution({ first, last: first }, last);
    assert.equal(merged.first.utm_source, "google");
    assert.equal(merged.last.utm_source, "facebook");
  });
});
