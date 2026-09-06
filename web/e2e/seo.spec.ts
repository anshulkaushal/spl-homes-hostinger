import { expect, test } from "@playwright/test";

test("unknown routes return 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist-spl-ci");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This page is not here." })).toBeVisible();
});

test("robots.txt is generated", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toMatch(/Disallow:\s*\//);
  expect(response.headers()["x-robots-tag"]).toMatch(/noindex,\s*nofollow/i);
});

test("sitemap.xml includes core routes", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain("/start-your-project");
  expect(body).toContain("/services/design-build");
});
