import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  HOSTINGER_API_BASE,
  HOSTINGER_UPLOAD_URLS_PATH,
  TUS_UPLOAD_BACKOFF_MS,
  TUS_UPLOAD_MAX_ATTEMPTS,
  buildStartBuildRequest,
  extractBuildUuid,
  extractFetchCauseFields,
  formatBuildFailureReport,
  formatFetchFailure,
  formatTusRetryReason,
  isRetryableTusFailure,
  looksLikeHtmlChallenge,
  nodejsBuildsPath,
  parseUploadUrlResource,
  redactSecrets,
  retryTusUpload,
  safeRequestHostname,
  summarizeApiError,
  tusUploadUrl,
} from "../../scripts/hostinger-deploy.mjs";

describe("Hostinger archive deploy API helpers", () => {
  it("uses the official Hostinger API host and upload-urls path", () => {
    assert.equal(HOSTINGER_API_BASE, "https://developers.hostinger.com");
    assert.equal(HOSTINGER_UPLOAD_URLS_PATH, "/api/hosting/v1/files/upload-urls");
    assert.equal(
      nodejsBuildsPath("u123", "staging.example.com"),
      "/api/hosting/v1/accounts/u123/websites/staging.example.com/nodejs/builds",
    );
  });

  it("parses TUS upload credentials from snake_case and nested payloads", () => {
    assert.deepEqual(
      parseUploadUrlResource({
        url: "https://files.example/tus",
        auth_key: "auth",
        rest_auth_key: "rest",
      }),
      { url: "https://files.example/tus", authKey: "auth", restAuthKey: "rest" },
    );
    assert.deepEqual(
      parseUploadUrlResource({
        data: {
          url: "https://files.example/tus/",
          authKey: "auth",
          restAuthKey: "rest",
        },
      }),
      { url: "https://files.example/tus/", authKey: "auth", restAuthKey: "rest" },
    );
  });

  it("builds the documented TUS target and Node.js archive build body", () => {
    assert.equal(
      tusUploadUrl("https://files.example/tus/", "spl-homes-web.zip"),
      "https://files.example/tus/spl-homes-web.zip?override=true",
    );
    assert.deepEqual(
      buildStartBuildRequest({
        archivePath: "C:/tmp/spl-homes-web.zip",
        nodeVersion: "22",
        buildScript: "build:hostinger",
        appType: "next",
        packageManager: "npm",
        outputDirectory: ".next",
        rootDirectory: "",
      }),
      {
        node_version: 22,
        app_type: "next",
        root_directory: ".",
        output_directory: ".next",
        build_script: "build:hostinger",
        package_manager: "npm",
        source_type: "archive",
        source_options: { archive_path: "spl-homes-web.zip" },
      },
    );
    assert.equal(extractBuildUuid({ data: { uuid: "build-1" } }), "build-1");
  });

  it("does not treat Cloudflare HTML as a usable API response", () => {
    const html = "<!DOCTYPE html><html><title>Just a moment...</title></html>";
    assert.equal(looksLikeHtmlChallenge(html), true);
    assert.match(
      summarizeApiError(403, html),
      /HTML\/Cloudflare challenge/,
    );
    assert.equal(looksLikeHtmlChallenge('{"url":"https://files.example/tus"}'), false);
  });

  it("prints the complete redacted Hostinger build log and failure fields", () => {
    const longLog = `${"npm install output ".repeat(40)}migrate:deploy failed after DATABASE_URL=mysql://user:secret@db/app`;
    const report = formatBuildFailureReport({
      details: {
        state: "failed",
        error: "Build failed",
        exit_code: 1,
        message: "Command failed: npm run build:hostinger",
      },
      logsText: JSON.stringify({
        logs: `${longLog}\nAuthorization: Bearer super-secret-token-value\nauth_key=tus-secret`,
      }),
      logsStatus: 200,
    });

    assert.match(report, /state: failed/);
    assert.match(report, /exit_code: 1/);
    assert.match(report, /Command failed: npm run build:hostinger/);
    assert.ok(report.includes(longLog.replace("DATABASE_URL=mysql://user:secret@db/app", "DATABASE_URL=***")));
    assert.ok(report.length > 500);
    assert.doesNotMatch(report, /super-secret-token-value/);
    assert.doesNotMatch(report, /tus-secret/);
    assert.doesNotMatch(report, /mysql:\/\/user:secret@db\/app/);
    assert.match(redactSecrets("password=hunter2"), /password=\*\*\*/);
  });

  it("reports safe fetch/network diagnostics without secrets or signed URLs", () => {
    const signedUrl =
      "https://tus.hostinger.example/files/spl-homes-web.zip?override=true&signature=super-signed-secret";
    const error = new TypeError(`fetch failed for ${signedUrl} with X-Auth: tus-header-secret`);
    error.cause = {
      name: "Error",
      message: "connect ECONNRESET",
      code: "ECONNRESET",
      errno: -4077,
      syscall: "connect",
      hostname: "tus.hostinger.example",
      address: "203.0.113.10",
      port: 443,
      extra: "should-not-appear",
    };

    const report = formatFetchFailure({
      operation: "TUS POST",
      method: "POST",
      url: signedUrl,
      error,
    });

    assert.match(report, /TUS POST failed: TypeError: fetch failed/);
    assert.match(report, /method: POST/);
    assert.match(report, /hostname: tus\.hostinger\.example/);
    assert.match(report, /code: ECONNRESET/);
    assert.match(report, /errno: -4077/);
    assert.match(report, /syscall: connect/);
    assert.match(report, /address: 203\.0\.113\.10/);
    assert.match(report, /port: 443/);
    assert.deepEqual(extractFetchCauseFields(error), {
      code: "ECONNRESET",
      errno: -4077,
      syscall: "connect",
      hostname: "tus.hostinger.example",
      address: "203.0.113.10",
      port: 443,
    });
    assert.equal(safeRequestHostname(signedUrl), "tus.hostinger.example");
    assert.doesNotMatch(report, /super-signed-secret/);
    assert.doesNotMatch(report, /tus-header-secret/);
    assert.doesNotMatch(report, /override=true/);
    assert.doesNotMatch(report, /https:\/\/tus\.hostinger\.example/);
    assert.doesNotMatch(report, /should-not-appear/);
    assert.doesNotMatch(
      formatFetchFailure({
        operation: "Hostinger API POST",
        method: "POST",
        url: "https://developers.hostinger.com/api/hosting/v1/files/upload-urls",
        error: {
          name: "TypeError",
          message: "fetch failed HOSTINGER_API_TOKEN=abc Authorization: Bearer leaked-token DATABASE_URL=mysql://user:secret@db/app",
          cause: { code: "ENOTFOUND", hostname: "developers.hostinger.com" },
        },
      }),
      /leaked-token|abc|mysql:\/\/user:secret@db\/app/,
    );
  });

  it("retries only transient TUS network and server failures", () => {
    const fetchFailed = new Error(
      formatFetchFailure({
        operation: "TUS POST",
        method: "POST",
        url: "https://tus.hostinger.example/files/spl-homes-web.zip?override=true&signature=super-signed-secret",
        error: Object.assign(new TypeError("fetch failed"), {
          cause: { code: "ECONNRESET", hostname: "tus.hostinger.example" },
        }),
      }),
    );
    const timedOut = Object.assign(new TypeError("fetch failed"), { cause: { code: "ETIMEDOUT" } });

    assert.equal(isRetryableTusFailure(new Error("TUS upload failed: 503 Bad Gateway")), true);
    assert.equal(isRetryableTusFailure(Object.assign(new Error("TUS create failed: 429 Too Many Requests"), { status: 429 })), true);
    assert.equal(isRetryableTusFailure(fetchFailed), true);
    assert.equal(isRetryableTusFailure(timedOut), true);
    assert.equal(isRetryableTusFailure(new Error("TUS create failed: 400 Bad Request")), false);
    assert.equal(isRetryableTusFailure(new Error("TUS upload failed: 401 Unauthorized")), false);
    assert.equal(isRetryableTusFailure(new Error("TUS create failed: 403 Forbidden")), false);
    assert.equal(isRetryableTusFailure(new Error("TUS upload failed: 404 Not Found")), false);
    assert.equal(formatTusRetryReason(new Error("TUS upload failed: 503 Bad Gateway")), "HTTP 503");
    assert.equal(formatTusRetryReason(timedOut), "ETIMEDOUT");
    assert.equal(formatTusRetryReason(fetchFailed), "ECONNRESET");
    assert.doesNotMatch(formatTusRetryReason(fetchFailed), /super-signed-secret|https:\/\//);
  });

  it("retries a TUS upload up to 3 times with 2s then 5s backoff", async () => {
    assert.deepEqual(TUS_UPLOAD_MAX_ATTEMPTS, 3);
    assert.deepEqual(TUS_UPLOAD_BACKOFF_MS, [2000, 5000]);

    const delays = [];
    const logs = [];
    let attempts = 0;
    await assert.rejects(
      () =>
        retryTusUpload(
          async () => {
            attempts += 1;
            throw new Error("TUS upload failed: 503 unavailable");
          },
          {
            sleep: async (ms) => {
              delays.push(ms);
            },
            log: (message) => logs.push(message),
          },
        ),
      /TUS upload failed: 503/,
    );

    assert.equal(attempts, 3);
    assert.deepEqual(delays, [2000, 5000]);
    assert.match(logs[0], /TUS upload attempt 1\/3 failed \(HTTP 503\); retrying in 2000ms/);
    assert.match(logs[1], /TUS upload attempt 2\/3 failed \(HTTP 503\); retrying in 5000ms/);
    assert.match(logs[2], /TUS upload attempt 3\/3 failed \(HTTP 503\); not retrying/);
    for (const message of logs) {
      assert.doesNotMatch(message, /Authorization|X-Auth|Bearer|password|signature=/i);
    }
  });

  it("does not retry permanent TUS 4xx errors", async () => {
    let attempts = 0;
    await assert.rejects(
      () =>
        retryTusUpload(
          async () => {
            attempts += 1;
            throw Object.assign(new Error("TUS create failed: 403 Forbidden"), { status: 403 });
          },
          {
            sleep: async () => {
              throw new Error("should not sleep for permanent TUS failures");
            },
            log: () => {},
          },
        ),
      /TUS create failed: 403/,
    );
    assert.equal(attempts, 1);
  });

  it("succeeds after a transient TUS failure without leaking upload secrets", async () => {
    let attempts = 0;
    const logs = [];
    const result = await retryTusUpload(
      async () => {
        attempts += 1;
        if (attempts === 1) {
          throw new Error(
            formatFetchFailure({
              operation: "TUS PATCH",
              method: "PATCH",
              url: "https://tus.hostinger.example/files/spl-homes-web.zip?override=true&signature=super-signed-secret",
              error: Object.assign(new TypeError("fetch failed"), { cause: { code: "ECONNRESET" } }),
            }),
          );
        }
        return "spl-homes-web.zip";
      },
      {
        sleep: async () => {},
        log: (message) => logs.push(message),
      },
    );

    assert.equal(result, "spl-homes-web.zip");
    assert.equal(attempts, 2);
    assert.match(logs[0], /attempt 1\/3 failed \(ECONNRESET\); retrying in 2000ms/);
    assert.doesNotMatch(logs.join("\n"), /super-signed-secret|tus\.hostinger\.example|https:\/\//);
  });
});
