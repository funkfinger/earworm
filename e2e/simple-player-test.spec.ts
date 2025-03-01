import { test, expect } from "@playwright/test";
import { setupConsoleLogs } from "./console-logger";

test.describe("Spotify Web Player - Simple Tests", () => {
  test.beforeEach(async ({ page, context }) => {
    // Set up console logging
    await setupConsoleLogs(page);

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
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          user: {
            id: "test-user",
            display_name: "Test User",
            images: [{ url: "https://example.com/avatar.jpg" }],
          },
        }),
      });
    });

    // Mock the token endpoint to return a valid token
    await page.route("**/api/auth/token", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          token: "mock-valid-token",
        }),
      });
    });

    // Go directly to the dashboard
    await page.goto("/dashboard", { waitUntil: "networkidle" });
  });

  test("dashboard page loads successfully", async ({ page }) => {
    // Verify that the dashboard page loads with a welcome message
    await expect(page.getByRole("heading", { name: /Welcome/i })).toBeVisible();

    // Check for user profile using a more specific selector
    await expect(page.getByTestId("user-profile")).toBeVisible();
  });
});
