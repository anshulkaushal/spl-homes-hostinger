export const X_ROBOTS_TAG_VALUE = "noindex, nofollow";

export function xRobotsTagHeader(noindex: boolean) {
  if (!noindex) return null;
  return { key: "X-Robots-Tag", value: X_ROBOTS_TAG_VALUE };
}

export function shouldApplyXRobotsTagPath(pathname: string) {
  return !pathname.startsWith("/_next/static") && !pathname.startsWith("/_next/image");
}
