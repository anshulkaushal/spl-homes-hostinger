import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  HOSTINGER_API_BASE,
  HOSTINGER_UPLOAD_URLS_PATH,
  buildStartBuildRequest,
  extractBuildUuid,
  looksLikeHtmlChallenge,
  nodejsBuildsPath,
  parseUploadUrlResource,
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
});
