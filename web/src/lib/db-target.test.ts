import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertDatabaseTargetForEnv,
  assertSplHomesProductionDatabaseTarget,
  assertSplHomesStagingDatabaseTarget,
} from "../../scripts/db-target.mjs";

const SPL_STAGING = "u182465577_stg_splhomes";
const SPL_PRODUCTION = "u182465577_splhomes_prod";
const SPL_PRODUCTION_LEGACY = "u182465577_prod_splhomes";
const ARO_STAGING = "u182465577_stg_aroaash";
const VENDING = "u182465577_vending_machine";

describe("SPL Homes database target guards", () => {
  it("accepts the SPL Homes staging database in staging", () => {
    assert.deepEqual(assertDatabaseTargetForEnv("staging", SPL_STAGING), { ok: true });
    assert.deepEqual(assertSplHomesStagingDatabaseTarget("splhomes_staging"), { ok: true });
    assert.deepEqual(assertSplHomesStagingDatabaseTarget("splhomes-staging"), { ok: true });
  });

  it("rejects the SPL Homes production database in staging", () => {
    assert.deepEqual(assertDatabaseTargetForEnv("staging", SPL_PRODUCTION), {
      ok: false,
      reason: "production",
    });
    assert.equal(assertSplHomesStagingDatabaseTarget("splhomes_prod").reason, "production");
    assert.equal(assertSplHomesStagingDatabaseTarget("splhomes_production").reason, "production");
  });

  it("accepts the SPL Homes production database in production", () => {
    assert.deepEqual(assertDatabaseTargetForEnv("production", SPL_PRODUCTION), { ok: true });
    assert.deepEqual(assertDatabaseTargetForEnv("production", SPL_PRODUCTION_LEGACY), { ok: true });
    assert.deepEqual(assertSplHomesProductionDatabaseTarget("splhomes_prod"), { ok: true });
    assert.deepEqual(assertSplHomesProductionDatabaseTarget("splhomes_production"), { ok: true });
  });

  it("rejects the SPL Homes staging database in production", () => {
    assert.deepEqual(assertDatabaseTargetForEnv("production", SPL_STAGING), {
      ok: false,
      reason: "staging",
    });
    assert.equal(assertSplHomesProductionDatabaseTarget("splhomes_staging").reason, "staging");
  });

  it("rejects AroAash staging and other unrelated databases", () => {
    assert.deepEqual(assertDatabaseTargetForEnv("staging", ARO_STAGING), {
      ok: false,
      reason: "not-spl-homes",
    });
    assert.deepEqual(assertDatabaseTargetForEnv("production", ARO_STAGING), {
      ok: false,
      reason: "not-spl-homes",
    });
    assert.deepEqual(assertDatabaseTargetForEnv("staging", VENDING), {
      ok: false,
      reason: "not-spl-homes",
    });
    assert.deepEqual(assertDatabaseTargetForEnv("production", "customer_stg_database"), {
      ok: false,
      reason: "not-spl-homes",
    });
    assert.deepEqual(assertDatabaseTargetForEnv("staging", "splhomes"), {
      ok: false,
      reason: "not-staging",
    });
    assert.deepEqual(assertDatabaseTargetForEnv("production", "splhomes"), {
      ok: false,
      reason: "not-production",
    });
  });

  it("fails closed for unknown environments and conflicting markers", () => {
    assert.deepEqual(assertDatabaseTargetForEnv("local", SPL_STAGING), {
      ok: false,
      reason: "unknown-env",
    });
    assert.deepEqual(assertDatabaseTargetForEnv("", SPL_PRODUCTION), {
      ok: false,
      reason: "unknown-env",
    });
    assert.deepEqual(assertDatabaseTargetForEnv("staging", "prod_stg_splhomes"), {
      ok: false,
      reason: "production",
    });
    assert.deepEqual(assertDatabaseTargetForEnv("production", "prod_stg_splhomes"), {
      ok: false,
      reason: "staging",
    });
  });
});
