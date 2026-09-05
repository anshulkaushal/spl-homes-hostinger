import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { mkdtemp, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { intakeLead, isSyntheticRequest, resetRateLimit } from "./lead-intake.ts";

const previousEnv = { ...process.env };

afterEach(() => {
  process.env = { ...previousEnv };
  resetRateLimit();
});

async function isolatedStore() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "spl-leads-"));
  const file = path.join(dir, "leads.json");
  await writeFile(file, "[]");
  process.env.USE_MYSQL = "false";
  process.env.LEADS_DATA_FILE = file;
}

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

const valid = {
  source: "planner",
  name: "Alex Taylor",
  email: "alex@example.com",
  phone: "021000000",
  project_type: "unsure",
  consent: true,
  location_suburb: "Tawa",
  location_region: "Wellington",
};

describe("lead intake", { concurrency: false }, () => {
  it("only marks synthetic leads when the CI header matches the server marker", () => {
    process.env.CI_LEAD_MARKER = "secret-marker";
    const publicRequest = request(valid);
    const ciRequest = request(valid, { "x-ci-lead-marker": "secret-marker" });
    const spoofed = request({ ...valid, isSynthetic: true });
    assert.equal(isSyntheticRequest(publicRequest), false);
    assert.equal(isSyntheticRequest(spoofed), false);
    assert.equal(isSyntheticRequest(ciRequest), true);
  });

  it("stores a successful lead and ignores public isSynthetic", async () => {
    resetRateLimit();
    await isolatedStore();
    process.env.CI_LEAD_MARKER = "secret-marker";
    const result = await intakeLead(request({ ...valid, isSynthetic: true, utm_source: "google" }), {
      ...valid,
      isSynthetic: true,
      utm_source: "google",
    });
    assert.equal(result.ok, true);
    if (result.ok && !result.ignored) {
      assert.equal(result.lead.is_synthetic, false);
      assert.equal(result.lead.utm_source, "google");
      assert.match(result.lead.reference, /^SPL-\d{6}-[0-9A-F]{4}$/);
    }
  });

  it("marks CI smoke leads as synthetic", async () => {
    resetRateLimit();
    await isolatedStore();
    process.env.CI_LEAD_MARKER = "secret-marker";
    const result = await intakeLead(request(valid, { "x-ci-lead-marker": "secret-marker" }), valid);
    assert.equal(result.ok, true);
    if (result.ok && !result.ignored) {
      assert.equal(result.lead.is_synthetic, true);
    }
  });

  it("returns the same lead for a repeated idempotency key", async () => {
    resetRateLimit();
    await isolatedStore();
    const key = "11111111-1111-4111-8111-111111111111";
    const first = await intakeLead(request(valid, { "idempotency-key": key }), {
      ...valid,
      idempotency_key: key,
    });
    const second = await intakeLead(request(valid, { "idempotency-key": key }), {
      ...valid,
      idempotency_key: key,
    });
    assert.equal(first.ok, true);
    assert.equal(second.ok, true);
    if (first.ok && !first.ignored && second.ok && !second.ignored) {
      assert.equal(second.duplicate, true);
      assert.equal(first.lead.reference, second.lead.reference);
    }
  });

  it("drops honeypot submissions", async () => {
    resetRateLimit();
    await isolatedStore();
    const result = await intakeLead(request({ ...valid, company: "Bot Co" }), { ...valid, company: "Bot Co" });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.ignored, true);
    }
  });
});
