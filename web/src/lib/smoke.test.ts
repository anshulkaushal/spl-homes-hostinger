import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  escapeWorkflowCommand,
  formatSmokeFailure,
  githubErrorAnnotation,
  smokeBodySnippet,
} from "../../scripts/smoke.mjs";

describe("smoke failure diagnostics", () => {
  it("formats path, expected condition, status, header and body snippet", () => {
    const report = formatSmokeFailure({
      path: "/robots.txt",
      expected: "X-Robots-Tag: noindex, nofollow",
      status: 200,
      headerName: "X-Robots-Tag",
      header: "",
      body: "User-Agent: *\nDisallow: /\n",
    });

    assert.match(report, /Smoke assertion failed/);
    assert.match(report, /path: \/robots\.txt/);
    assert.match(report, /expected: X-Robots-Tag: noindex, nofollow/);
    assert.match(report, /status: 200/);
    assert.match(report, /X-Robots-Tag: \(missing\)/);
    assert.match(report, /body: User-Agent: \* Disallow: \//);
  });

  it("emits a GitHub Actions error annotation and redacts secrets", () => {
    const report = formatSmokeFailure({
      path: "/api/leads",
      expected: "Lead submission failed",
      status: 500,
      body: [
        "Authorization: Bearer leaked-token-value",
        "HOSTINGER_API_TOKEN=abc123secret",
        "DATABASE_URL=mysql://user:secret@db/app",
        "contact ci-smoke@example.com",
      ].join("\n"),
    });
    const annotation = githubErrorAnnotation({
      title: "Smoke /api/leads",
      message: report,
    });

    assert.match(annotation, /^::error file=web\/scripts\/smoke\.mjs,title=/);
    assert.match(annotation, /Smoke assertion failed/);
    assert.equal(escapeWorkflowCommand("a\nb%c"), "a%0Ab%25c");
    assert.doesNotMatch(report, /leaked-token-value/);
    assert.doesNotMatch(report, /abc123secret/);
    assert.doesNotMatch(report, /mysql:\/\/user:secret@db\/app/);
    assert.doesNotMatch(report, /ci-smoke@example\.com/);
    assert.doesNotMatch(annotation, /leaked-token-value|abc123secret|mysql:\/\/user:secret@db\/app|ci-smoke@example\.com/);
    assert.match(smokeBodySnippet("ok DATABASE_URL=mysql://user:secret@db/app"), /DATABASE_URL=\*\*\*/);
  });
});
