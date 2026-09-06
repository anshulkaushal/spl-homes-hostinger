import { NextResponse } from "next/server";

export const ADMIN_AFTER_LOGIN_PATH = "/admin";

export function createAdminLoginRedirect() {
  return new NextResponse(null, {
    status: 303,
    headers: { Location: ADMIN_AFTER_LOGIN_PATH },
  });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";
  const ok = expected !== "" && password === expected;

  const response = createAdminLoginRedirect();
  if (ok) {
    response.cookies.set("spl_admin", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.APP_ENV === "production",
      path: "/",
    });
  }
  return response;
}
