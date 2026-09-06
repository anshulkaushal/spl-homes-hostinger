import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { ADMIN_AFTER_LOGIN_PATH, POST } from "./admin/login/route.ts";

function loginRequest(origin: string, password: string) {
  const body = new URLSearchParams({ password });
  return new Request(`${origin}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}

function location(response: Response) {
  return response.headers.get("location") ?? "";
}

describe("admin login redirect", () => {
  const previous = { ...process.env };

  afterEach(() => {
    process.env = { ...previous };
  });

  it("redirects successful authentication to a public-safe /admin path", async () => {
    process.env.ADMIN_PASSWORD = "correct-horse";
    process.env.APP_ENV = "staging";
    const response = await POST(loginRequest("https://0.0.0.0:3000", "correct-horse"));
    const dest = location(response);

    assert.equal(response.status, 303);
    assert.equal(dest, ADMIN_AFTER_LOGIN_PATH);
    assert.equal(dest, "/admin");
    assert.doesNotMatch(dest, /0\.0\.0\.0/);
    assert.doesNotMatch(dest, /localhost/i);
    assert.doesNotMatch(dest, /:\d+/);
    assert.match(response.headers.get("set-cookie") ?? "", /spl_admin=1/);
  });

  it("does not use the internal Node bind address from request.url", async () => {
    process.env.ADMIN_PASSWORD = "correct-horse";
    for (const origin of [
      "https://0.0.0.0:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
    ]) {
      const response = await POST(loginRequest(origin, "correct-horse"));
      const dest = location(response);
      assert.equal(dest, "/admin");
      assert.doesNotMatch(dest, /0\.0\.0\.0|127\.0\.0\.1|localhost|:\d+/i);
    }
  });

  it("still redirects failed authentication to /admin without setting the cookie", async () => {
    process.env.ADMIN_PASSWORD = "correct-horse";
    const response = await POST(loginRequest("https://0.0.0.0:3000", "wrong"));
    assert.equal(location(response), "/admin");
    assert.doesNotMatch(response.headers.get("set-cookie") ?? "", /spl_admin=1/);
  });
});
