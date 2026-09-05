import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createReference } from "./reference.ts";

describe("createReference", () => {
  it("uses SPL-YYMMDD-XXXX", () => {
    const value = createReference(new Date(2026, 8, 5, 12, 0, 0));
    assert.match(value, /^SPL-260905-[0-9A-F]{4}$/);
  });

  it("creates unique suffixes", () => {
    const first = createReference(new Date(2026, 8, 5, 12, 0, 0));
    const second = createReference(new Date(2026, 8, 5, 12, 0, 0));
    assert.notEqual(first, second);
  });
});
