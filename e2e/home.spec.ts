import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load the home page", async ({ page }) => {
    // Navigate to the home page
    await page.goto("/");

    // Verify the page has loaded
    await expect(page).toHaveTitle(/De Worm/);
  });

  test("should have basic accessibility features", async ({ page }) => {
    // Navigate to the home page
    await page.goto("/");

    // Check for basic accessibility attributes
    const heading = await page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();

    // Check for semantic HTML structure
    const main = await page.locator("main");
    await expect(main).toBeVisible();
  });
});
