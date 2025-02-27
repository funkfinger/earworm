import { expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import SpotifyLogin from "../app/components/SpotifyLogin";

beforeEach(() => {
  cleanup();
  // Mock environment variables
  vi.stubEnv("NEXT_PUBLIC_SPOTIFY_CLIENT_ID", "test-client-id");
  vi.stubEnv(
    "NEXT_PUBLIC_SPOTIFY_REDIRECT_URI",
    "http://localhost:3000/callback"
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
});

test("Spotify login button exists", () => {
  render(<SpotifyLogin />);
  const loginButton = screen.getByRole("button", {
    name: /login with spotify/i,
  });
  expect(loginButton).toBeDefined();
});

test("Clicking Spotify login initiates OAuth flow", async () => {
  render(<SpotifyLogin />);
  const loginButton = screen.getByRole("button", {
    name: /login with spotify/i,
  });

  // Mock window.location.href assignment
  const mockAssign = vi.fn();
  const originalLocation = window.location;
  Object.defineProperty(window, "location", {
    value: { ...originalLocation, assign: mockAssign },
    writable: true,
  });

  await loginButton.click();

  expect(mockAssign).toHaveBeenCalledWith(
    expect.stringContaining("accounts.spotify.com/authorize")
  );

  // Restore original window.location
  Object.defineProperty(window, "location", {
    value: originalLocation,
    writable: true,
  });
});
