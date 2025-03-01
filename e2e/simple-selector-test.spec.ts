import { test, expect } from "@playwright/test";
import { setupConsoleLogs } from "./console-logger";

test.describe("Random Song Selector - Simple Tests", () => {
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

    // Mock the playlist tracks endpoint
    await page.route("**/v1/playlists/*/tracks*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              track: {
                id: "mock-track-id",
                name: "Mock Track Name",
                artists: [
                  {
                    name: "Mock Artist",
                    id: "artist-id",
                    uri: "spotify:artist:artist-id",
                  },
                ],
                album: {
                  name: "Mock Album",
                  id: "album-id",
                  images: [{ url: "https://example.com/album.jpg" }],
                },
                external_urls: {
                  spotify: "https://open.spotify.com/track/mock-track-id",
                },
              },
            },
          ],
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
