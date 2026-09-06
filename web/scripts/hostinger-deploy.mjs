import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const HOSTINGER_API_BASE = "https://developers.hostinger.com";
export const HOSTINGER_UPLOAD_URLS_PATH = "/api/hosting/v1/files/upload-urls";

export function nodejsBuildsPath(username, domain) {
  return `/api/hosting/v1/accounts/${encodeURIComponent(username)}/websites/${encodeURIComponent(domain)}/nodejs/builds`;
}

export function nodejsBuildDetailsPath(username, domain, uuid) {
  return `${nodejsBuildsPath(username, domain)}/${encodeURIComponent(uuid)}`;
}

export function nodejsBuildLogsPath(username, domain, uuid) {
  return `${nodejsBuildDetailsPath(username, domain, uuid)}/logs`;
}

export function looksLikeHtmlChallenge(text) {
  const sample = String(text || "").slice(0, 2000);
  return (
    /<!DOCTYPE html/i.test(sample) ||
    /<html[\s>]/i.test(sample) ||
    /Just a moment/i.test(sample) ||
    /cf-browser-verification/i.test(sample)
  );
}

export function summarizeApiError(status, text) {
  if (looksLikeHtmlChallenge(text)) {
    return `${status} Hostinger API returned an HTML/Cloudflare challenge instead of JSON. Use ${HOSTINGER_API_BASE} with Accept: application/json.`;
  }
  return `${status} ${String(text || "").replace(/\s+/g, " ").trim().slice(0, 500)}`;
}

export function unwrapResource(payload) {
  if (payload && typeof payload === "object" && payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    return payload.data;
  }
  return payload;
}

export function parseUploadUrlResource(payload) {
  const resource = unwrapResource(payload);
  const url = resource?.url;
  const authKey = resource?.auth_key || resource?.authKey;
  const restAuthKey = resource?.rest_auth_key || resource?.restAuthKey;
  if (!url || !authKey || !restAuthKey) {
    throw new Error("Upload URL response did not include url, auth_key and rest_auth_key");
  }
  return { url, authKey, restAuthKey };
}

export function tusUploadUrl(baseUrl, relativeFilePath) {
  const trimmed = String(baseUrl).replace(/\/+$/, "");
  const encodedPath = String(relativeFilePath)
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${trimmed}/${encodedPath}?override=true`;
}

export function parseNodeVersion(value) {
  const version = Number.parseInt(String(value), 10);
  if (![18, 20, 22, 24].includes(version)) {
    throw new Error(`Unsupported HOSTINGER_NODE_VERSION: ${value}`);
  }
  return version;
}

export function buildStartBuildRequest({
  archivePath,
  nodeVersion,
  buildScript,
  appType,
  packageManager,
  outputDirectory,
  rootDirectory,
}) {
  return {
    node_version: parseNodeVersion(nodeVersion),
    app_type: appType,
    root_directory: rootDirectory || ".",
    output_directory: outputDirectory,
    build_script: buildScript,
    package_manager: packageManager,
    source_type: "archive",
    source_options: {
      archive_path: path.basename(archivePath),
    },
  };
}

export function extractBuildUuid(payload) {
  const resource = unwrapResource(payload);
  return resource?.uuid || resource?.id || payload?.uuid || payload?.id;
}

export function extractBuildState(payload) {
  const resource = unwrapResource(payload);
  return resource?.state || resource?.status || payload?.state || payload?.status;
}

export function redactSecrets(text) {
  return String(text ?? "")
    .replace(/\bDATABASE_URL\s*[=:]\s*\S+/gi, "DATABASE_URL=***")
    .replace(/\bHOSTINGER_API_TOKEN\s*[=:]\s*\S+/gi, "HOSTINGER_API_TOKEN=***")
    .replace(/\b(?:mysql|mariadb|postgres|postgresql|mongodb(?:\+srv)?):\/\/[^\s"'`]+/gi, "***REDACTED_DB_URL***")
    .replace(/\bAuthorization\s*:\s*Bearer\s+\S+/gi, "Authorization: Bearer ***")
    .replace(/\bBearer\s+[A-Za-z0-9._\-+/=]{12,}/g, "Bearer ***")
    .replace(/\bX-Auth(?:-Rest)?\s*:\s*\S+/gi, (match) => `${match.split(":")[0]}: ***`)
    .replace(/\b(?:auth_key|rest_auth_key|authKey|restAuthKey)\s*[=:]\s*\S+/gi, (match) => `${match.split(/[=:]/)[0]}=***`)
    .replace(/\b(?:password|passwd|pwd)\s*[=:]\s*\S+/gi, "password=***");
}

const FETCH_CAUSE_KEYS = ["code", "errno", "syscall", "hostname", "address", "port"];

export function safeRequestHostname(urlLike) {
  try {
    return new URL(String(urlLike)).hostname || "unknown-host";
  } catch {
    return "unknown-host";
  }
}

export function stripRequestUrls(text) {
  return String(text ?? "").replace(/https?:\/\/[^\s"'`]+/gi, (match) => safeRequestHostname(match));
}

export function extractFetchCauseFields(error) {
  const cause = error && typeof error === "object" ? error.cause : undefined;
  if (!cause || typeof cause !== "object") return {};
  const fields = {};
  for (const key of FETCH_CAUSE_KEYS) {
    if (cause[key] != null && cause[key] !== "") {
      fields[key] = cause[key];
    }
  }
  return fields;
}

export function formatFetchFailure({ operation, method, url, error }) {
  const err = error && typeof error === "object" ? error : { message: String(error) };
  const name = err.name || "Error";
  const message = stripRequestUrls(err.message != null ? String(err.message) : String(error));
  const cause = extractFetchCauseFields(err);
  const lines = [
    `${operation} failed: ${name}: ${message}`,
    `method: ${method || "GET"}`,
    `hostname: ${safeRequestHostname(url)}`,
  ];
  for (const key of FETCH_CAUSE_KEYS) {
    if (cause[key] != null) {
      lines.push(`${key}: ${cause[key]}`);
    }
  }
  return redactSecrets(lines.join("\n"));
}

async function fetchOrDiagnose(url, init, operation) {
  try {
    return await fetch(url, init);
  } catch (error) {
    throw new Error(
      formatFetchFailure({
        operation,
        method: init?.method || "GET",
        url,
        error,
      }),
    );
  }
}

export function extractBuildFailureFields(details) {
  const resource = unwrapResource(details) || {};
  const fields = {};
  for (const key of [
    "state",
    "status",
    "error",
    "message",
    "exit_code",
    "exitCode",
    "failure_reason",
    "failureReason",
    "error_message",
    "errorMessage",
  ]) {
    if (resource[key] != null && resource[key] !== "") {
      fields[key] = resource[key];
    }
  }
  return fields;
}

export function extractBuildLogText(logsPayloadOrText) {
  if (logsPayloadOrText && typeof logsPayloadOrText === "object") {
    const resource = unwrapResource(logsPayloadOrText);
    if (typeof resource?.logs === "string") return resource.logs;
    if (typeof resource?.log === "string") return resource.log;
    if (typeof resource?.output === "string") return resource.output;
    return JSON.stringify(logsPayloadOrText, null, 2);
  }

  const text = String(logsPayloadOrText ?? "");
  try {
    return extractBuildLogText(JSON.parse(text));
  } catch {
    return text;
  }
}

export function formatBuildFailureReport({ details, logsText, logsStatus }) {
  const fields = extractBuildFailureFields(details);
  const fieldLines = Object.entries(fields).map(([key, value]) => {
    const printed = typeof value === "object" ? JSON.stringify(value) : String(value);
    return `${key}: ${redactSecrets(printed)}`;
  });
  return [
    "Hostinger Node.js build failed",
    logsStatus != null ? `logs HTTP status: ${logsStatus}` : null,
    ...fieldLines,
    "----- Hostinger build log start -----",
    redactSecrets(extractBuildLogText(logsText)),
    "----- Hostinger build log end -----",
  ]
    .filter(Boolean)
    .join("\n");
}

async function readResponseText(response) {
  return response.text();
}

async function parseJsonResponse(response, label) {
  const text = await readResponseText(response);
  if (looksLikeHtmlChallenge(text)) {
    throw new Error(`${label} failed: ${summarizeApiError(response.status, text)}`);
  }
  if (!response.ok) {
    throw new Error(`${label} failed: ${summarizeApiError(response.status, text)}`);
  }
  if (!text.trim()) {
    throw new Error(`${label} returned an empty response`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} returned non-JSON: ${text.replace(/\s+/g, " ").trim().slice(0, 300)}`);
  }
}

function apiHeaders(token, extra = {}) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "User-Agent": "spl-homes-hostinger-deploy/1.0",
    ...extra,
  };
}

async function hostingerApi(token, pathname, init = {}) {
  const headers = apiHeaders(token, init.headers || {});
  if (init.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return fetchOrDiagnose(
    `${HOSTINGER_API_BASE}${pathname}`,
    {
      ...init,
      headers,
    },
    `Hostinger API ${init.method || "GET"} ${pathname}`,
  );
}

export const TUS_UPLOAD_MAX_ATTEMPTS = 3;
export const TUS_UPLOAD_BACKOFF_MS = [2000, 5000];

const TRANSIENT_NETWORK_CODES = ["ETIMEDOUT", "ECONNRESET"];

function collectFailureText(error) {
  if (error == null) return "";
  if (typeof error !== "object") return String(error);
  const parts = [error.message, error.code, error.cause?.code, error.cause?.message];
  return parts.filter(Boolean).join("\n");
}

export function extractTusFailureStatus(error) {
  if (error && typeof error === "object") {
    const status = error.status ?? error.statusCode;
    if (Number.isInteger(status) && status >= 100 && status <= 599) {
      return status;
    }
  }
  const match = collectFailureText(error).match(/TUS (?:create|upload) failed:\s*(\d{3})\b/);
  return match ? Number(match[1]) : undefined;
}

export function formatTusRetryReason(error) {
  const status = extractTusFailureStatus(error);
  if (status != null) return `HTTP ${status}`;

  const text = collectFailureText(error);
  for (const code of TRANSIENT_NETWORK_CODES) {
    if (text.includes(code)) return code;
  }
  if (/fetch failed/i.test(text)) return "fetch failed";

  const firstLine = redactSecrets(stripRequestUrls(text.split("\n")[0] || "unknown error")).slice(0, 80);
  return firstLine || "unknown error";
}

export function isRetryableTusFailure(error) {
  const status = extractTusFailureStatus(error);
  if (status != null) {
    return status === 429 || status >= 500;
  }

  const text = collectFailureText(error);
  return TRANSIENT_NETWORK_CODES.some((code) => text.includes(code)) || /fetch failed/i.test(text);
}

function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryTusUpload(operation, { sleep = defaultSleep, log = console.warn } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= TUS_UPLOAD_MAX_ATTEMPTS; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const reason = formatTusRetryReason(error);
      const retryable = isRetryableTusFailure(error);
      const delay = TUS_UPLOAD_BACKOFF_MS[attempt - 1];
      if (!retryable || attempt === TUS_UPLOAD_MAX_ATTEMPTS || delay == null) {
        log(`TUS upload attempt ${attempt}/${TUS_UPLOAD_MAX_ATTEMPTS} failed (${reason}); not retrying`);
        throw error;
      }
      log(`TUS upload attempt ${attempt}/${TUS_UPLOAD_MAX_ATTEMPTS} failed (${reason}); retrying in ${delay}ms`);
      await sleep(delay);
    }
  }
  throw lastError;
}

async function tusRequest(url, { authKey, restAuthKey, method, headers = {}, body }) {
  return fetchOrDiagnose(
    url,
    {
      method,
      headers: {
        "X-Auth": authKey,
        "X-Auth-Rest": restAuthKey,
        "Tus-Resumable": "1.0.0",
        "User-Agent": "spl-homes-hostinger-deploy/1.0",
        ...headers,
      },
      body,
    },
    `TUS ${method}`,
  );
}

function throwTusHttpError(kind, status, text) {
  const error = new Error(`TUS ${kind} failed: ${summarizeApiError(status, text)}`);
  error.status = status;
  throw error;
}

async function uploadArchiveWithTusOnce(archivePath, { url, authKey, restAuthKey }) {
  const archiveName = path.basename(archivePath);
  const size = statSync(archivePath).size;
  const target = tusUploadUrl(url, archiveName);
  const bytes = readFileSync(archivePath);

  const created = await tusRequest(target, {
    authKey,
    restAuthKey,
    method: "POST",
    headers: {
      "Upload-Length": String(size),
      "Upload-Offset": "0",
    },
  });
  if (![200, 201].includes(created.status)) {
    throwTusHttpError("create", created.status, await created.text());
  }

  const patched = await tusRequest(target, {
    authKey,
    restAuthKey,
    method: "PATCH",
    headers: {
      "Content-Type": "application/offset+octet-stream",
      "Upload-Offset": "0",
    },
    body: bytes,
  });
  if (![200, 204].includes(patched.status)) {
    throwTusHttpError("upload", patched.status, await patched.text());
  }

  return archiveName;
}

async function uploadArchiveWithTus(archivePath, credentials) {
  return retryTusUpload(() => uploadArchiveWithTusOnce(archivePath, credentials));
}

export async function deployFromEnv(env = process.env) {
  const token = env.HOSTINGER_API_TOKEN;
  const username = env.HOSTINGER_USERNAME;
  const domain = env.HOSTINGER_DOMAIN;
  const archivePath = env.HOSTINGER_ARCHIVE;
  const nodeVersion = env.HOSTINGER_NODE_VERSION || "22";
  const buildScript = env.HOSTINGER_BUILD_SCRIPT || "build";
  const appType = env.HOSTINGER_APP_TYPE || "next";
  const packageManager = env.HOSTINGER_PACKAGE_MANAGER || "npm";
  const outputDirectory = env.HOSTINGER_OUTPUT_DIRECTORY || ".next";
  const rootDirectory = env.HOSTINGER_ROOT_DIRECTORY || ".";

  if (!token || !username || !domain || !archivePath) {
    throw new Error("HOSTINGER_API_TOKEN, HOSTINGER_USERNAME, HOSTINGER_DOMAIN and HOSTINGER_ARCHIVE are required");
  }

  const size = statSync(archivePath).size;
  if (size > 50 * 1024 * 1024) {
    throw new Error(`Archive is ${size} bytes; Hostinger limit is 50MB`);
  }

  const archiveName = path.basename(archivePath);
  console.log(`Requesting Hostinger TUS upload URL for ${archiveName} (${size} bytes)`);

  const uploadResponse = await hostingerApi(token, HOSTINGER_UPLOAD_URLS_PATH, {
    method: "POST",
    body: JSON.stringify({ username, domain }),
  });
  const uploadPayload = await parseJsonResponse(uploadResponse, "Generate upload URL");
  const upload = parseUploadUrlResource(uploadPayload);

  console.log(`Uploading ${archiveName} via TUS`);
  await uploadArchiveWithTus(archivePath, upload);

  const startBody = buildStartBuildRequest({
    archivePath,
    nodeVersion,
    buildScript,
    appType,
    packageManager,
    outputDirectory,
    rootDirectory,
  });
  console.log(`Starting Hostinger Node.js build from archive ${startBody.source_options.archive_path}`);

  const startResponse = await hostingerApi(token, nodejsBuildsPath(username, domain), {
    method: "POST",
    body: JSON.stringify(startBody),
  });
  const startPayload = await parseJsonResponse(startResponse, "Start Node.js build");
  const uuid = extractBuildUuid(startPayload);
  if (!uuid) {
    throw new Error("Hostinger did not return a build UUID");
  }

  console.log(`Build started: ${uuid}`);

  for (let attempt = 0; attempt < 60; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 15000));
    const detailsResponse = await hostingerApi(token, nodejsBuildDetailsPath(username, domain, uuid));
    const details = await parseJsonResponse(detailsResponse, "Get Node.js build details");
    const state = extractBuildState(details);
    console.log(`Build state: ${state}`);
    if (state === "completed" || state === "success") {
      console.log("Hostinger build completed");
      return;
    }
    if (state === "failed" || state === "error") {
      const logsResponse = await hostingerApi(token, nodejsBuildLogsPath(username, domain, uuid));
      const logs = await readResponseText(logsResponse);
      const report = formatBuildFailureReport({
        details,
        logsText: logs,
        logsStatus: logsResponse.status,
      });
      console.error(report);
      throw new Error(report);
    }
  }

  throw new Error("Timed out waiting for the Hostinger build");
}

function isDirectRun() {
  const invoked = process.argv[1] && path.resolve(process.argv[1]);
  if (!invoked) return false;
  return path.normalize(fileURLToPath(import.meta.url)).toLowerCase() === path.normalize(invoked).toLowerCase();
}

if (isDirectRun()) {
  deployFromEnv().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
