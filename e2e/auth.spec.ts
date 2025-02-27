import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Continue all requests by default
    await page.route("**/*", async (route) => {
      await route.continue();
    });

    // Mock the /api/auth/me endpoint to return no user
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: false, error: "Not logged in" }),
      });
    });

    await page.goto("/");
  });

  test("shows initial landing page with login button", async ({ page }) => {
    await page.goto("/");

    // Verify page content
    await expect(page.getByText("DeWorm")).toBeVisible();
    await expect(
      page.getByText(
        "Discover and remove those pesky earworms with the power of music"
      )
    ).toBeVisible();

    // Verify login button
    const loginButton = page.getByTestId("spotify-login-button");
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveText("Login with Spotify");
    await expect(page.getByTestId("spotify-icon")).toBeVisible();

    // Verify features are visible
    await expect(page.getByTestId("feature-identify")).toBeVisible();
    await expect(page.getByTestId("feature-listen")).toBeVisible();
    await expect(page.getByTestId("feature-move-on")).toBeVisible();
  });

  test("handles successful authentication flow", async ({ page, context }) => {
    // Set auth cookie
    await context.addCookies([
      {
        name: "spotify_token",
        value: "mock-token",
        domain: "localhost",
        path: "/",
      },
    ]);

    // Mock successful profile fetch
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
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

    await page.goto("/?login=success");

    // Verify user profile is shown
    await expect(page.getByTestId("user-profile")).toBeVisible();
    await expect(page.getByText("Test User")).toBeVisible();
    await expect(page.getByTestId("spotify-login-button")).not.toBeVisible();
  });

  test("handles failed authentication", async ({ page }) => {
    await page.goto("/?error=authentication_failed");

    // Verify error state
    await expect(page.getByText("authentication failed")).toBeVisible();
    await expect(page.getByTestId("spotify-login-button")).toBeVisible();
  });

  test("handles logout flow", async ({ page, context }) => {
    // Set up profile endpoint mock
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
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

    // Set initial authenticated state
    await context.addCookies([
      {
        name: "spotify_token",
        value: "mock-token",
        domain: "localhost",
        path: "/",
      },
    ]);

    // Navigate to the page with login=success to trigger profile fetch
    await page.goto("/?login=success");

    // Wait for user profile to be rendered
    const userProfile = page.getByTestId("user-profile");
    await expect(userProfile).toBeVisible();
    await expect(page.getByText("Test User")).toBeVisible();

    // Mock logout endpoint
    await page.route("**/api/auth/logout", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    // Click logout and wait for the response
    const logoutButton = page.getByRole("button", { name: "Logout" });
    await Promise.all([
      logoutButton.click(),
      page.waitForResponse(
        (response) =>
          response.url().includes("/api/auth/logout") &&
          response.status() === 200
      ),
    ]);

    // Verify logged out state
    await expect(page.getByTestId("spotify-login-button")).toBeVisible();
    await expect(userProfile).not.toBeVisible();
  });

  test("handles callback errors", async ({ page }) => {
    // Test various callback error scenarios
    const errorScenarios = [
      { param: "error=no_code", expected: "no code" },
      {
        param: "error=token_exchange_failed",
        expected: "token exchange failed",
      },
      {
        param: "error=authentication_failed",
        expected: "authentication failed",
      },
    ];

    for (const scenario of errorScenarios) {
      await page.goto(`/?${scenario.param}`);
      await expect(page.getByText(scenario.expected)).toBeVisible();
    }
  });
});
