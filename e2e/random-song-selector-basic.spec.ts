import { test, expect } from "@playwright/test";
import * as path from "path";

test.describe("Random Song Selector Basic Tests", () => {
  test("displays a random track when API returns data successfully", async ({
    page,
  }) => {
    // Load the static HTML test page
    await page.goto(
      `file://${path.resolve("./e2e/test-pages/random-song-selector.html")}`
    );

    // Wait for the random song selector component to load
    await page.waitForSelector('[data-testid="random-song-selector"]', {
      timeout: 5000,
    });

    // Check that the track information is displayed
    const trackName = await page.getByText("Test Track");
    await expect(trackName).toBeVisible();

    const artistName = await page.getByText("Test Artist");
    await expect(artistName).toBeVisible();
  });

  test("displays error message when playlist fetch fails", async ({ page }) => {
    // Load the static HTML test page
    await page.goto(
      `file://${path.resolve("./e2e/test-pages/random-song-selector.html")}`
    );

    // Wait for the random song selector component to load
    await page.waitForSelector('[data-testid="random-song-selector-error"]', {
      timeout: 5000,
    });

    // Check for the error message
    const errorMessage = await page.getByText(
      "Failed to get a random track from the playlist"
    );
    await expect(errorMessage).toBeVisible();
  });

  test("displays item_before_load error message", async ({ page }) => {
    // Load the static HTML test page
    await page.goto(
      `file://${path.resolve("./e2e/test-pages/random-song-selector.html")}`
    );

    // Wait for the random song selector component to load
    await page.waitForSelector('[data-testid="random-song-selector-no-list"]', {
      timeout: 5000,
    });

    // Check for the specific error message
    const errorMessage = await page.getByText(
      "Cannot perform operation; no list was loaded"
    );
    await expect(errorMessage).toBeVisible();
  });
});
