import { test, expect } from "@playwright/test";

test.describe("Welcome Screen Flow", () => {
  test("should display welcome screen and navigate to login", async ({
    page,
  }) => {
    // Navigate to the home page
    await page.goto("/");

    // Check that we're on the welcome screen
    await expect(page.getByText("Welcome to De Worm!")).toBeVisible();

    // Check for QT mascot
    await expect(page.getByAltText("QT Mascot")).toBeVisible();

    // Check for welcome text
    await expect(page.getByText(/Hi there! I'm QT/)).toBeVisible();
    await expect(page.getByText(/Got a song stuck in your head/)).toBeVisible();

    // Click the get started button
    await page.getByText("Let's Get Started!").click();

    // Check that we've navigated to the login page
    await expect(page.getByText("Connect with Spotify")).toBeVisible();

    // Verify login page elements
    await expect(page.getByText(/To help cure your earworm/)).toBeVisible();
    await expect(
      page.getByText(/We only use your Spotify account/)
    ).toBeVisible();
  });
});
