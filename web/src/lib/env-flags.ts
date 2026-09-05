export function shouldNoindex() {
  return process.env.NOINDEX === "true" || process.env.APP_ENV === "staging";
}

export function isProduction() {
  return process.env.APP_ENV === "production";
}
