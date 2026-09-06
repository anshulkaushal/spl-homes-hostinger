import { NextResponse } from "next/server";
import { ADMIN_AFTER_LOGIN_PATH } from "../login/route";

export function createAdminLogoutRedirect() {
  return new NextResponse(null, {
    status: 303,
    headers: { Location: ADMIN_AFTER_LOGIN_PATH },
  });
}

export async function POST() {
  const response = createAdminLogoutRedirect();
  response.cookies.set("spl_admin", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.APP_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
