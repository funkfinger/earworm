import { expect, test, vi, beforeEach } from "vitest";
import { cookies } from "next/headers";
import {
  handleTokenExchange,
  getValidToken,
  logout,
} from "../app/actions/auth";

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Mock the spotify lib functions
vi.mock("../app/lib/spotify", () => ({
  exchangeCodeForToken: vi.fn(),
  refreshAccessToken: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test("logout deletes the auth cookie", async () => {
  const mockDelete = vi.fn();
  const mockCookies = vi.mocked(cookies);
  mockCookies.mockReturnValue({
    get: vi.fn(),
    set: vi.fn(),
    delete: mockDelete,
  });

  await logout();

  expect(mockDelete).toHaveBeenCalledWith("spotify_tokens");
});
