import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";
  const ok = expected !== "" && password === expected;

  const url = new URL("/admin", request.url);
  const response = NextResponse.redirect(url);
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
