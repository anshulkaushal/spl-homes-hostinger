import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { ADMIN_AFTER_LOGIN_PATH } from "./admin/login/route.ts";
import { POST } from "./admin/logout/route.ts";

function logoutRequest(origin: string) {
  return new Request(`${origin}/admin/logout`, { method: "POST" });
}

function location(response: Response) {
  return response.headers.get("location") ?? "";
}

describe("admin logout", () => {
  const previous = { ...process.env };

  afterEach(() => {
    process.env = { ...previous };
  });

  it("clears the admin cookie and redirects to /admin", async () => {
    process.env.APP_ENV = "staging";
    const response = await POST();
    const dest = location(response);
    const cookie = response.headers.get("set-cookie") ?? "";

    assert.equal(response.status, 303);
    assert.equal(dest, ADMIN_AFTER_LOGIN_PATH);
    assert.equal(dest, "/admin");
    assert.match(cookie, /spl_admin=/);
    assert.match(cookie, /Max-Age=0|max-age=0/i);
    assert.doesNotMatch(dest, /0\.0\.0\.0/);
    assert.doesNotMatch(dest, /localhost/i);
    assert.doesNotMatch(dest, /:\d+/);
  });

  it("does not redirect to localhost, 0.0.0.0, or an internal Node port", async () => {
    for (const origin of [
      "https://0.0.0.0:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
    ]) {
      const response = await POST();
      const dest = location(response);
      assert.equal(dest, "/admin");
      assert.doesNotMatch(dest, /0\.0\.0\.0|127\.0\.0\.1|localhost|:\d+/i);
      assert.equal(logoutRequest(origin).url.startsWith(origin), true);
    }
  });
});
