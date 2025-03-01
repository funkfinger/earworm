import { test, expect } from "@playwright/test";
import * as path from "path";

test.describe("Spotify Web Player Basic Tests", () => {
  test.beforeEach(async ({ page, context }) => {
    // Set up authentication mocks
    await context.addCookies([
      {
        name: "spotify_token",
        value: "mock-valid-token",
        domain: "localhost",
        path: "/",
      },
      {
        name: "spotify_refresh_token",
        value: "mock-refresh-token",
        domain: "localhost",
        path: "/",
      },
    ]);

    // Mock the auth/me endpoint to return a logged-in user
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          user: {
            id: "mock-user-id",
            display_name: "Test User",
            images: [{ url: "https://example.com/avatar.jpg" }],
          },
        },
      });
    });

    // Mock the auth/token endpoint to return a valid token
    await page.route("**/api/auth/token", async (route) => {
      await route.fulfill({
        status: 200,
        json: { access_token: "mock-valid-token" },
      });
    });
  });

  test("displays error message when no active device is found", async ({
    page,
  }) => {
    // Load the static HTML test page
    await page.goto(
      `file://${path.resolve("./e2e/test-pages/spotify-player.html")}`
    );

    // Wait for the player component to load
    await page.waitForSelector('[data-testid="spotify-player"]', {
      timeout: 5000,
    });

    // Check for the error message
    const errorMessage = await page.getByText("No active Spotify device found");
    await expect(errorMessage).toBeVisible();
  });

  test("displays premium account required message", async ({ page }) => {
    // Load the static HTML test page
    await page.goto(
      `file://${path.resolve("./e2e/test-pages/spotify-player.html")}`
    );

    // Wait for the player component to load
    await page.waitForSelector('[data-testid="spotify-player-premium"]', {
      timeout: 5000,
    });

    // Check for the premium required message
    const errorMessage = await page.getByText(
      "This functionality is restricted to premium users only"
    );
    await expect(errorMessage).toBeVisible();
  });

  test("displays no list loaded error message", async ({ page }) => {
    // Load the static HTML test page
    await page.goto(
      `file://${path.resolve("./e2e/test-pages/spotify-player.html")}`
    );

    // Wait for the player component to load
    await page.waitForSelector('[data-testid="spotify-player-no-list"]', {
      timeout: 5000,
    });

    // Check for the no list loaded message
    const errorMessage = await page.getByText(
      "Cannot perform operation; no list was loaded"
    );
    await expect(errorMessage).toBeVisible();
  });
});
