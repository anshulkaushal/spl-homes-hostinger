import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { shouldNoindex } from "@/lib/env-flags";
import { shouldApplyXRobotsTagPath, xRobotsTagHeader } from "@/lib/robots-tag";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (!shouldApplyXRobotsTagPath(request.nextUrl.pathname)) {
    return response;
  }

  const header = xRobotsTagHeader(shouldNoindex());
  if (header) {
    response.headers.set(header.key, header.value);
  }
  return response;
}

export const config = {
  matcher: ["/", "/((?!_next/static|_next/image).*)"],
};
