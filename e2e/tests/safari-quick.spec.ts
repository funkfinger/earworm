import { test, expect } from "@playwright/test";

test.describe("De Worm App Quick Safari Tests", () => {
  test("welcome screen loads and navigates to login", async ({ page }) => {
    // Visit the home page
    await page.goto("/");

    // Wait for splash screen to disappear
    await page.waitForTimeout(3000);

    // Check if we're on the welcome screen
    await expect(
      page.getByText("Got a song stuck in your head?")
    ).toBeVisible();

    // Click on the get started button
    await page.getByText("Let's Get Started!").click();

    // Check if we're on the login page
    await expect(
      page.getByRole("heading", { name: "Connect with Spotify" })
    ).toBeVisible();
    await expect(page.getByText("Connect to Spotify")).toBeVisible();
  });

  test("search page loads and accepts input", async ({ page }) => {
    // Go directly to the search page
    await page.goto("/search");

    // Check if we're on the search page
    await expect(page.getByText("What's stuck in your head?")).toBeVisible({
      timeout: 10000,
    });

    // Fill in the search form
    await page
      .getByPlaceholder("Search for a song or artist...")
      .fill("Test Song");

    // Submit the search
    await page.getByText("Find My Earworm").click();

    // Since our implementation doesn't actually search, we just verify the placeholder is still there
    await expect(
      page.getByText("This is a placeholder for the search screen")
    ).toBeVisible();
  });

  test("playback page loads with feedback options", async ({ page }) => {
    // Go directly to the playback page with a song ID
    await page.goto("/playback?songId=1");

    // Check if we're on the playback page
    await expect(page.getByText("Your Earworm Cure")).toBeVisible({
      timeout: 10000,
    });

    // Check for the earworm and replacement song sections
    await expect(page.getByText("Your Earworm:")).toBeVisible();
    await expect(page.getByText("Replacement Song:")).toBeVisible();

    // Click the play button to trigger the feedback screen
    await page.getByText("Play Replacement Song").click();

    // Wait for the playback to complete
    await page.waitForTimeout(6000);

    // Now check for feedback options
    await expect(page.getByText("Did it work?")).toBeVisible({
      timeout: 10000,
    });
  });
});
