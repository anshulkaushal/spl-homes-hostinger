import { expect, test } from "@playwright/test";

test("desktop services dropdown lists the seven services", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const services = page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: "Services", exact: true });
  await services.hover();
  const menu = page.getByRole("navigation", { name: "Primary" });
  await expect(menu.getByRole("link", { name: "New Homes", exact: true })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Design & Build", exact: true })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Commercial", exact: true })).toBeVisible();
});

test("mobile hamburger opens navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.locator("#mobile-nav");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Our Process", exact: true })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Contact", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Call", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start project", exact: true })).toBeVisible();
});
