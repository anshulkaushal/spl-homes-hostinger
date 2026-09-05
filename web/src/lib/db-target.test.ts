import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertStagingDatabaseTarget } from "../../scripts/db-target.mjs";

describe("staging database name safety", () => {
  it("accepts explicit staging markers", () => {
    for (const name of [
      "u182465577_stg_splhomes",
      "splhomes_staging",
      "splhomes-staging",
      "customer_stg_database",
    ]) {
      assert.deepEqual(assertStagingDatabaseTarget(name), { ok: true }, name);
    }
  });

  it("rejects unmarked or production-like names", () => {
    assert.equal(assertStagingDatabaseTarget("splhomes").ok, false);
    assert.equal(assertStagingDatabaseTarget("splhomes_prod").reason, "production");
    assert.equal(assertStagingDatabaseTarget("splhomes_production").reason, "production");
    assert.equal(assertStagingDatabaseTarget("stagecoach").reason, "not-staging");
    assert.equal(assertStagingDatabaseTarget("testing").reason, "not-staging");
    assert.equal(assertStagingDatabaseTarget("stagingproduction").reason, "not-staging");
  });

  it("rejects conflicting production markers even when a staging marker exists", () => {
    assert.deepEqual(assertStagingDatabaseTarget("prod_stg_fake"), {
      ok: false,
      reason: "production",
    });
  });
});
