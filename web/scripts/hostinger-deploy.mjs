import { readFileSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const token = process.env.HOSTINGER_API_TOKEN;
const username = process.env.HOSTINGER_USERNAME;
const domain = process.env.HOSTINGER_DOMAIN;
const archivePath = process.env.HOSTINGER_ARCHIVE;
const nodeVersion = process.env.HOSTINGER_NODE_VERSION || "22";
const buildScript = process.env.HOSTINGER_BUILD_SCRIPT || "build";
const appType = process.env.HOSTINGER_APP_TYPE || "next";
const packageManager = process.env.HOSTINGER_PACKAGE_MANAGER || "npm";
const outputDirectory = process.env.HOSTINGER_OUTPUT_DIRECTORY || ".next";
const rootDirectory = process.env.HOSTINGER_ROOT_DIRECTORY || "";

if (!token || !username || !domain || !archivePath) {
  console.error("HOSTINGER_API_TOKEN, HOSTINGER_USERNAME, HOSTINGER_DOMAIN and HOSTINGER_ARCHIVE are required");
  process.exit(1);
}

const api = (pathname, init = {}) =>
  fetch(`https://developers.hostinger.com${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });

const archiveName = path.basename(archivePath);
const size = statSync(archivePath).size;
if (size > 50 * 1024 * 1024) {
  console.error(`Archive is ${size} bytes; Hostinger limit is 50MB`);
  process.exit(1);
}

const form = new FormData();
form.set(
  "archive",
  new Blob([readFileSync(archivePath)], { type: "application/zip" }),
  archiveName,
);
form.set("node_version", nodeVersion);
form.set("build_script", buildScript);
form.set("app_type", appType);
form.set("package_manager", packageManager);
form.set("output_directory", outputDirectory);
if (rootDirectory) form.set("root_directory", rootDirectory);

console.log(`Uploading ${archiveName} (${size} bytes) to ${domain}`);

const create = await api(
  `/api/hosting/v1/accounts/${encodeURIComponent(username)}/websites/${encodeURIComponent(domain)}/nodejs/builds/from-archive`,
  { method: "POST", body: form },
);

if (!create.ok) {
  console.error(`from-archive failed (${create.status}). Falling back to upload URL + start build.`);
  console.error(await create.text());

  const upload = await api(
    `/api/hosting/v1/accounts/${encodeURIComponent(username)}/websites/${encodeURIComponent(domain)}/files/upload`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: archiveName }),
    },
  );

  if (!upload.ok) {
    console.error(`Generate upload URL failed: ${upload.status} ${await upload.text()}`);
    console.error("Use the official Hostinger API token and confirm the Node.js website already exists.");
    process.exit(1);
  }

  const uploadPayload = await upload.json();
  const putUrl = uploadPayload.url || uploadPayload.data?.url;
  if (!putUrl) {
    console.error("Upload URL response did not include a URL", uploadPayload);
    process.exit(1);
  }

  const put = spawnSync("curl", ["-sS", "-X", "PUT", "-H", `Authorization: Bearer ${token}`, "--data-binary", `@${archivePath}`, putUrl], {
    encoding: "utf8",
  });
  if (put.status !== 0) {
    console.error(put.stderr || put.stdout);
    process.exit(1);
  }

  const start = await api(
    `/api/hosting/v1/accounts/${encodeURIComponent(username)}/websites/${encodeURIComponent(domain)}/nodejs/builds`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_type: "archive",
        source_options: { archive_path: archiveName },
        node_version: nodeVersion,
        build_script: buildScript,
        app_type: appType,
        package_manager: packageManager,
        output_directory: outputDirectory,
        root_directory: rootDirectory || ".",
      }),
    },
  );

  if (!start.ok) {
    console.error(`Start build failed: ${start.status} ${await start.text()}`);
    process.exit(1);
  }

  var build = await start.json();
} else {
  var build = await create.json();
}

const uuid = build.uuid || build.data?.uuid || build.id;
if (!uuid) {
  console.error("Hostinger did not return a build UUID", build);
  process.exit(1);
}

console.log(`Build started: ${uuid}`);

for (let attempt = 0; attempt < 60; attempt += 1) {
  await new Promise((resolve) => setTimeout(resolve, 15000));
  const details = await api(
    `/api/hosting/v1/accounts/${encodeURIComponent(username)}/websites/${encodeURIComponent(domain)}/nodejs/builds/${encodeURIComponent(uuid)}`,
  );
  const body = await details.json();
  const state = body.state || body.data?.state || body.status;
  console.log(`Build state: ${state}`);
  if (state === "completed" || state === "success") {
    console.log("Hostinger build completed");
    process.exit(0);
  }
  if (state === "failed" || state === "error") {
    const logs = await api(
      `/api/hosting/v1/accounts/${encodeURIComponent(username)}/websites/${encodeURIComponent(domain)}/nodejs/builds/${encodeURIComponent(uuid)}/logs`,
    );
    console.error(await logs.text());
    process.exit(1);
  }
}

console.error("Timed out waiting for the Hostinger build");
process.exit(1);
