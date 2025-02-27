import { expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import CallbackPage from "../app/callback/page";

const mockPush = vi.fn();
const mockGet = vi.fn();
const mockHandleTokenExchange = vi.fn();

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// Mock auth action
vi.mock("../app/actions/auth", () => ({
  handleTokenExchange: () => mockHandleTokenExchange(),
}));

beforeEach(() => {
  cleanup(); // Clean up DOM after each test
  mockPush.mockClear();
  mockGet.mockClear();
  mockHandleTokenExchange.mockClear();
  console.log = vi.fn();
  console.error = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("Callback page shows loading state", () => {
  render(<CallbackPage />);
  expect(screen.getByText("Logging you in...")).toBeDefined();
  expect(screen.getByRole("status")).toBeDefined();
});

test("Redirects to error page when Spotify returns an error", async () => {
  mockGet.mockImplementation((param) => {
    if (param === "error") return "access_denied";
    return null;
  });

  render(<CallbackPage />);

  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith("/?error=spotify_auth_failed");
  });
});

test("Redirects to error page when no code is present", async () => {
  mockGet.mockImplementation((param) => {
    if (param === "code") return null;
    return null;
  });

  render(<CallbackPage />);

  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith("/?error=no_code");
  });
});

test("Handles successful authorization code", async () => {
  const testCode = "test-auth-code";
  mockGet.mockImplementation((param) => {
    if (param === "code") return testCode;
    return null;
  });
  mockHandleTokenExchange.mockResolvedValue(undefined);

  render(<CallbackPage />);

  await waitFor(() => {
    expect(mockHandleTokenExchange).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
