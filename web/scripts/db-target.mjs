function hasDelimitedToken(value, token) {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[_-])${escaped}(?:[_-]|$)`, "i").test(value);
}

export function looksLikeProductionDatabase(database, host = "") {
  const name = database.trim();
  const hostname = host.trim();
  if (/^spl[_-]?homes$/i.test(name)) return true;
  return (
    hasDelimitedToken(name, "prod") ||
    hasDelimitedToken(name, "production") ||
    hasDelimitedToken(hostname, "prod") ||
    hasDelimitedToken(hostname, "production")
  );
}

export function looksLikeStagingDatabase(database, host = "") {
  const name = database.trim();
  const hostname = host.trim();
  return (
    hasDelimitedToken(name, "stg") ||
    hasDelimitedToken(name, "staging") ||
    hasDelimitedToken(hostname, "stg") ||
    hasDelimitedToken(hostname, "staging")
  );
}

export function assertStagingDatabaseTarget(database, host = "") {
  if (looksLikeProductionDatabase(database, host)) {
    return { ok: false, reason: "production" };
  }
  if (!looksLikeStagingDatabase(database, host)) {
    return { ok: false, reason: "not-staging" };
  }
  return { ok: true };
}
