import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { leadSchema } from "./lead-schema.ts";

describe("leadSchema", () => {
  it("accepts a planner enquiry and normalises project type", () => {
    const parsed = leadSchema.safeParse({
      source: "planner",
      name: "Alex Taylor",
      email: "alex@example.com",
      phone: "021000000",
      project_type: "new-home",
      consent: true,
      utm_source: "google",
      gclid: "abc",
    });
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.project_type, "new_home");
      assert.equal(parsed.data.utm_source, "google");
      assert.equal(parsed.data.gclid, "abc");
    }
  });

  it("rejects missing consent", () => {
    const parsed = leadSchema.safeParse({
      source: "contact",
      name: "Alex Taylor",
      email: "alex@example.com",
      project_type: "renovation",
      consent: false,
    });
    assert.equal(parsed.success, false);
  });

  it("rejects an invalid email", () => {
    const parsed = leadSchema.safeParse({
      source: "guide",
      name: "Alex",
      email: "not-an-email",
      project_type: "extension",
      consent: true,
    });
    assert.equal(parsed.success, false);
  });

  it("rejects an unknown project type", () => {
    const parsed = leadSchema.safeParse({
      source: "planner",
      name: "Alex Taylor",
      email: "alex@example.com",
      project_type: "spaceship",
      consent: true,
    });
    assert.equal(parsed.success, false);
  });

  it("ignores a public isSynthetic flag at parse time", () => {
    const parsed = leadSchema.safeParse({
      source: "planner",
      name: "Alex Taylor",
      email: "alex@example.com",
      project_type: "unsure",
      consent: true,
      isSynthetic: true,
    });
    assert.equal(parsed.success, true);
  });
});
