import { expect, test } from "@playwright/test";

test("project planner completes a new home enquiry", async ({ page }) => {
  await page.goto("/start-your-project?type=new_home");
  await expect(page.getByRole("heading", { name: "Project type" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Build a new home", pressed: true })).toBeVisible();
  await page.getByTestId("planner-continue").click();

  await expect(page.getByTestId("planner-step")).toHaveText("Location");
  await page.locator("#suburb").fill("Tawa");
  await page.getByTestId("planner-continue").click();

  await expect(page.getByRole("heading", { name: "Project stage" })).toBeVisible();
  await page.getByRole("button", { name: "Researching" }).click();
  await page.getByTestId("planner-continue").click();

  await expect(page.getByText("Do you own the land?")).toBeVisible();
  await page.getByRole("button", { name: "Yes" }).first().click();
  await page.getByLabel("Approximate floor area").fill("180m2");
  await page.getByTestId("planner-continue").click();

  await page.getByRole("button", { name: "Not sure" }).click();
  await page.getByTestId("planner-continue").click();

  await page.getByRole("button", { name: "Research stage" }).click();
  await page.getByTestId("planner-continue").click();

  await expect(page.getByRole("heading", { name: "Contact details" })).toBeVisible();
  await page.getByLabel("Name", { exact: true }).fill("Alex Taylor");
  await page.getByLabel("Email").fill("alex@example.com");
  await page.getByLabel("Phone").fill("021000000");
  await page.getByTestId("planner-continue").click();

  await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
  await page.getByRole("button", { name: "Submit enquiry" }).click();
  await expect(page.getByText(/Your reference is/)).toBeVisible({ timeout: 15_000 });
});

test("renovation planner asks scope questions instead of land ownership", async ({ page }) => {
  await page.goto("/start-your-project?type=renovation");
  await expect(page.getByRole("heading", { name: "Project type" })).toBeVisible();
  await page.getByTestId("planner-continue").click();
  await expect(page.getByTestId("planner-step")).toHaveText("Location");
  await page.locator("#suburb").fill("Island Bay");
  await page.getByTestId("planner-continue").click();
  await page.getByRole("button", { name: "Looking for a builder" }).click();
  await page.getByTestId("planner-continue").click();
  await expect(page.getByText("What does the work include?")).toBeVisible();
  await expect(page.getByText("Do you own the land?")).toHaveCount(0);
  await page.getByRole("button", { name: "Kitchen" }).click();
});
