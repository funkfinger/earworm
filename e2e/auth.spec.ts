import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ context }) => {
    // Set required environment variables for all tests
    await context.addInitScript(() => {
      window.process = {
        ...window.process,
        env: {
          NODE_ENV: "test",
          NEXT_PUBLIC_SPOTIFY_CLIENT_ID: "test-client-id",
          NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: "http://localhost:3000/callback",
          SPOTIFY_CLIENT_SECRET: "test-client-secret",
        },
      };
    });
  });

  test("shows login button when not authenticated", async ({ page }) => {
    await page.goto("/");

    // Should see the login button
    const loginButton = page.getByRole("button", {
      name: /login with spotify/i,
    });
    await expect(loginButton).toBeVisible();

    // Should see the main heading
    await expect(page.getByRole("heading", { name: "DeWorm" })).toBeVisible();
  });

  test("hides login button when authenticated", async ({ page, context }) => {
    // Set up authenticated state by adding the cookie
    await context.addCookies([
      {
        name: "spotify_tokens",
        value: JSON.stringify({
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token",
          expiresAt: Date.now() + 3600000, // 1 hour from now
        }),
        url: "http://localhost:3000",
      },
    ]);

    await page.goto("/");

    // Should not see the login button
    const loginButton = page.getByRole("button", {
      name: /login with spotify/i,
    });
    await expect(loginButton).not.toBeVisible();
  });

  test("redirects to Spotify OAuth when clicking login", async ({ page }) => {
    await page.goto("/");

    // Create a promise for navigation before clicking
    const navigationPromise = page.waitForNavigation();

    // Click the login button
    await page.getByRole("button", { name: /login with spotify/i }).click();

    // Wait for navigation to complete
    const navigation = await navigationPromise;
    if (!navigation) throw new Error("Navigation did not occur");

    // Verify OAuth parameters
    const url = new URL(navigation.url());
    expect(url.hostname).toBe("accounts.spotify.com");
    expect(url.pathname).toBe("/authorize");
    expect(url.searchParams.get("client_id")).toBeTruthy();
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("redirect_uri")).toBeTruthy();
    expect(url.searchParams.get("scope")).toBeTruthy();
  });

  test("handles successful OAuth callback", async ({ page }) => {
    // Enable request logging
    page.on("request", (request) =>
      console.log(`>> ${request.method()} ${request.url()}`, request.postData())
    );
    page.on("response", async (response) => {
      console.log(`<< ${response.status()} ${response.url()}`);
      try {
        const body = await response.text();
        console.log("Response body:", body);
      } catch (e) {
        console.log("Could not get response body");
      }
    });

    // Mock Spotify's token endpoint
    await page.route(
      "https://accounts.spotify.com/api/token",
      async (route) => {
        const request = route.request();
        console.log("Token request headers:", request.headers());
        console.log("Token request body:", request.postData());

        await route.fulfill({
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: "mock-access-token",
            refresh_token: "mock-refresh-token",
            expires_in: 3600,
            token_type: "Bearer",
            scope: "user-read-private user-read-email",
          }),
        });
      }
    );

    // Mock Spotify's profile endpoint
    await page.route("https://api.spotify.com/v1/me", async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "test-user-id",
          display_name: "Test User",
          email: "test@example.com",
          images: [{ url: "https://example.com/avatar.jpg" }],
        }),
      });
    });

    // Set up cookie for the test
    await page.context().addCookies([
      {
        name: "spotify_tokens",
        value: JSON.stringify({
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token",
          expiresAt: Date.now() + 3600000,
        }),
        url: "http://localhost:3000",
      },
    ]);

    // Simulate OAuth callback
    await page.goto("/callback?code=mock-auth-code");

    // Wait for token exchange and redirect
    await expect(page).toHaveURL("/dashboard", { timeout: 15000 });

    // Verify cookie was updated
    const cookies = await page.context().cookies();
    const authCookie = cookies.find((c) => c.name === "spotify_tokens");
    expect(authCookie).toBeDefined();
    const cookieValue = JSON.parse(authCookie?.value || "{}");
    expect(cookieValue.accessToken).toBe("mock-access-token");
  });

  test("handles OAuth errors", async ({ page }) => {
    await page.goto("/callback?error=access_denied");

    // Should redirect to home with error
    await expect(page).toHaveURL("/?error=spotify_auth_failed");
  });
});
