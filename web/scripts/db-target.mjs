function hasDelimitedToken(value, token) {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[_-])${escaped}(?:[_-]|$)`, "i").test(value);
}

export function isSplHomesDatabaseName(database) {
  const name = String(database ?? "").trim();
  return (
    hasDelimitedToken(name, "splhomes") ||
    hasDelimitedToken(name, "spl_homes") ||
    hasDelimitedToken(name, "spl-homes")
  );
}

export function looksLikeProductionDatabase(database, host = "") {
  const name = String(database ?? "").trim();
  const hostname = String(host ?? "").trim();
  return (
    hasDelimitedToken(name, "prod") ||
    hasDelimitedToken(name, "production") ||
    hasDelimitedToken(hostname, "prod") ||
    hasDelimitedToken(hostname, "production")
  );
}

export function looksLikeStagingDatabase(database, host = "") {
  const name = String(database ?? "").trim();
  const hostname = String(host ?? "").trim();
  return (
    hasDelimitedToken(name, "stg") ||
    hasDelimitedToken(name, "staging") ||
    hasDelimitedToken(hostname, "stg") ||
    hasDelimitedToken(hostname, "staging")
  );
}

export function assertSplHomesStagingDatabaseTarget(database, host = "") {
  if (!isSplHomesDatabaseName(database)) {
    return { ok: false, reason: "not-spl-homes" };
  }
  if (looksLikeProductionDatabase(database, host)) {
    return { ok: false, reason: "production" };
  }
  if (!looksLikeStagingDatabase(database, host)) {
    return { ok: false, reason: "not-staging" };
  }
  return { ok: true };
}

export function assertSplHomesProductionDatabaseTarget(database, host = "") {
  if (!isSplHomesDatabaseName(database)) {
    return { ok: false, reason: "not-spl-homes" };
  }
  if (looksLikeStagingDatabase(database, host)) {
    return { ok: false, reason: "staging" };
  }
  if (!looksLikeProductionDatabase(database, host)) {
    return { ok: false, reason: "not-production" };
  }
  return { ok: true };
}

export function assertStagingDatabaseTarget(database, host = "") {
  return assertSplHomesStagingDatabaseTarget(database, host);
}

export function assertDatabaseTargetForEnv(appEnv, database, host = "") {
  if (appEnv === "staging") {
    return assertSplHomesStagingDatabaseTarget(database, host);
  }
  if (appEnv === "production") {
    return assertSplHomesProductionDatabaseTarget(database, host);
  }
  return { ok: false, reason: "unknown-env" };
}
