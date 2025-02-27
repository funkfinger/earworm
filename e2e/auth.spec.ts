import { test, expect } from "@playwright/test";

test.describe("Spotify Authentication", () => {
  test("should show login button on landing page", async ({ page }) => {
    await page.goto("/");

    const loginButton = page.getByRole("button", {
      name: /login with spotify/i,
    });
    await expect(loginButton).toBeVisible();

    // Verify Spotify branding
    await expect(loginButton).toHaveClass(/bg-\[#1DB954\]/);
    await expect(page.getByTestId("spotify-icon")).toBeVisible();
  });

  test("should handle login button click", async ({ page }) => {
    // Mock Spotify OAuth endpoint
    await page.route("**/api/auth/spotify", async (route) => {
      const spotifyAuthUrl = "https://accounts.spotify.com/authorize";
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ url: spotifyAuthUrl }),
      });
    });

    await page.goto("/");

    // Click login and verify loading state
    const loginButton = page.getByRole("button", {
      name: /login with spotify/i,
    });
    await loginButton.click();

    await expect(page.getByTestId("loading-spinner")).toBeVisible();
  });

  test("should show error state on auth failure", async ({ page }) => {
    // Mock failed auth response
    await page.route("**/api/auth/spotify", async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({
          success: false,
          error: "Failed to connect to Spotify",
        }),
      });
    });

    await page.goto("/");

    const loginButton = page.getByRole("button", {
      name: /login with spotify/i,
    });
    await loginButton.click();

    // Verify error state
    await expect(page.getByText("Failed to connect to Spotify")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /try again/i })
    ).toBeVisible();
  });

  test("should handle successful Spotify login flow", async ({ page }) => {
    // Mock Spotify OAuth endpoints
    await page.route("**/api/auth/spotify", async (route) => {
      const spotifyAuthUrl = "https://accounts.spotify.com/authorize";
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ url: spotifyAuthUrl }),
      });
    });

    // Mock the OAuth callback
    await page.route("**/api/auth/callback**", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          user: {
            id: "test-user-id",
            display_name: "Test User",
            images: [{ url: "https://example.com/avatar.jpg" }],
          },
        }),
      });
    });

    // Start from landing page
    await page.goto("/");

    // Verify initial state and click login
    const loginButton = page.getByRole("button", {
      name: /login with spotify/i,
    });
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    // Wait for navigation and response handling
    await page.waitForResponse("**/api/auth/callback**");

    // Verify logged in state with increased timeout
    await expect(page.getByTestId("user-profile")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Test User")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible({
      timeout: 10000,
    });
  });

  test("should handle logout", async ({ page }) => {
    await page.goto("/");

    // Set up mock logged in state
    await page.evaluate(() => {
      localStorage.setItem("spotify_token", "mock-token");
      // Trigger a re-render or state update if needed
      window.dispatchEvent(new Event("storage"));
    });

    await page.reload();

    // Mock logout endpoint
    await page.route("**/api/auth/logout", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    // Wait for and click logout button with increased timeout
    const logoutButton = page.getByRole("button", { name: /logout/i });
    await expect(logoutButton).toBeVisible({ timeout: 10000 });
    await logoutButton.click();

    // Wait for the logout response
    await page.waitForResponse("**/api/auth/logout");

    // Verify logged out state
    await expect(
      page.getByRole("button", { name: /login with spotify/i })
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId("user-profile")).not.toBeVisible();
  });
});
