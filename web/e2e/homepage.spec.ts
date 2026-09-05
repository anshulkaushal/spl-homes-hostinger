import { expect, test } from "@playwright/test";

test("homepage answers who, what, where and the next step", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Build Better");
  await expect(page.getByRole("heading", { name: "What are you planning?" })).toBeVisible();
  await expect(page.getByText("Wellington region builders")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Home" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start your project" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "What we can build with you." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Featured projects" })).toBeVisible();
  await expect(page.getByText(/sample content/i).first()).toBeVisible();
});

test("featured project navigation opens a sample case study", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Sample new home, Karori/i }).click();
  await expect(page).toHaveURL(/\/projects\/sample-karori-new-home/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Sample new home");
  await expect(page.getByText("Sample content").first()).toBeVisible();
});

test("contact CTA is available from the homepage", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Talk to SPL Homes" }).click();
  await expect(page).toHaveURL(/\/contact/);
  await expect(page.getByRole("heading", { name: /contact|talk/i })).toBeVisible();
});
