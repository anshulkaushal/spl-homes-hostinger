import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildProjectDetails,
  canAdvance,
  detailProfileFor,
  emptyPlannerForm,
  normalizeProjectType,
  type PlannerForm,
} from "./planner.ts";

function form(overrides: Partial<PlannerForm> = {}): PlannerForm {
  return { ...emptyPlannerForm, ...overrides };
}

describe("planner conditionals", () => {
  it("normalises legacy project types", () => {
    assert.equal(normalizeProjectType("new-home"), "new_home");
    assert.equal(normalizeProjectType("knockdown-rebuild"), "knockdown_rebuild");
    assert.equal(normalizeProjectType("not-sure"), "unsure");
    assert.equal(normalizeProjectType("new_home"), "new_home");
  });

  it("asks new-build questions for new homes and knockdown rebuilds", () => {
    assert.equal(detailProfileFor("new_home"), "new_build");
    assert.equal(detailProfileFor("knockdown_rebuild"), "new_build");
    assert.equal(detailProfileFor("renovation"), "renovation");
    assert.equal(detailProfileFor("unsure"), "unsure");
  });

  it("requires type, location, stage, budget, timeframe and contact before advancing", () => {
    assert.equal(canAdvance(0, form()), false);
    assert.equal(canAdvance(0, form({ project_type: "new_home" })), true);
    assert.equal(canAdvance(1, form({ suburb: "Tawa", city: "" })), false);
    assert.equal(canAdvance(1, form({ suburb: "Tawa", city: "Wellington" })), true);
    assert.equal(canAdvance(6, form({ name: "A", email: "a@b.com", phone: "021" })), false);
    assert.equal(
      canAdvance(6, form({ name: "Alex Taylor", email: "alex@example.com", phone: "021000000" })),
      true,
    );
  });

  it("builds project details from conditional answers", () => {
    const details = buildProjectDetails(
      form({
        owns_land: "Yes",
        bedrooms: "4",
        reno_scope: ["Kitchen"],
        notes: "North-facing living.",
      }),
    );
    assert.match(details, /Owns land: Yes/);
    assert.match(details, /Bedrooms: 4/);
    assert.match(details, /Scope: Kitchen/);
    assert.match(details, /North-facing living/);
  });
});
