import { expect, test, vi, beforeEach, beforeAll, afterAll } from "vitest";
import { exchangeCodeForToken, refreshAccessToken } from "../app/lib/spotify";

const mockFetch = vi.fn();

beforeAll(() => {
  // Mock fetch globally
  global.fetch = mockFetch;

  // Mock Buffer more reliably
  const mockBuffer = {
    from: (str: string) => ({
      toString: (encoding: string) => "mock-base64",
    }),
  };

  vi.stubGlobal("Buffer", mockBuffer);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  mockFetch.mockReset();

  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID = "test-client-id";
  process.env.SPOTIFY_CLIENT_SECRET = "test-client-secret";
  process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI =
    "http://localhost:3000/callback";
});

test("exchangeCodeForToken success", async () => {
  const mockResponse = {
    access_token: "mock-access-token",
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: "mock-refresh-token",
    scope: "user-read-private user-read-email",
  };

  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockResponse),
  });

  const result = await exchangeCodeForToken("test-code");

  expect(result).toEqual(mockResponse);
  expect(mockFetch).toHaveBeenCalledWith(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic mock-base64",
      },
      body: expect.any(URLSearchParams),
    }
  );

  const callArgs = mockFetch.mock.calls[0][1];
  const bodyParams = new URLSearchParams(callArgs.body);
  expect(bodyParams.get("grant_type")).toBe("authorization_code");
  expect(bodyParams.get("code")).toBe("test-code");
  expect(bodyParams.get("redirect_uri")).toBe("http://localhost:3000/callback");
});

test("exchangeCodeForToken failure", async () => {
  mockFetch.mockResolvedValue({
    ok: false,
    json: () => Promise.resolve({ error_description: "Invalid code" }),
  });

  await expect(exchangeCodeForToken("invalid-code")).rejects.toThrow(
    "Invalid code"
  );
});

test("refreshAccessToken success", async () => {
  const mockResponse = {
    access_token: "new-access-token",
    token_type: "Bearer",
    expires_in: 3600,
    scope: "user-read-private user-read-email",
  };

  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockResponse),
  });

  const result = await refreshAccessToken("mock-refresh-token");

  expect(result).toEqual(mockResponse);
  expect(mockFetch).toHaveBeenCalledWith(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic mock-base64",
      },
      body: expect.any(URLSearchParams),
    }
  );

  const callArgs = mockFetch.mock.calls[0][1];
  const bodyParams = new URLSearchParams(callArgs.body);
  expect(bodyParams.get("grant_type")).toBe("refresh_token");
  expect(bodyParams.get("refresh_token")).toBe("mock-refresh-token");
});
