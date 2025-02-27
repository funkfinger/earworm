import { expect, test, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import CallbackPage from "../app/callback/page";

// Mock the next/navigation module
vi.mock("next/navigation", () => {
  const mockRouter = {
    push: vi.fn(),
  };
  const mockSearchParams = {
    get: vi.fn(),
  };
  return {
    useRouter: () => mockRouter,
    useSearchParams: () => mockSearchParams,
  };
});

import { useRouter, useSearchParams } from "next/navigation";

beforeEach(() => {
  vi.resetAllMocks();
});

test("redirects to dashboard on successful authentication", async () => {
  // Mock the search params to include a code
  const mockSearchParams = useSearchParams();
  vi.mocked(mockSearchParams.get).mockImplementation((param) =>
    param === "code" ? "mock-auth-code" : null
  );

  // Mock the router
  const mockRouter = useRouter();
  const mockPush = vi.mocked(mockRouter.push);

  // Mock the fetch response for successful token exchange
  global.fetch = vi.fn().mockResolvedValue({
    json: vi.fn().mockResolvedValue({ success: true }),
  });

  // Render the callback page
  render(<CallbackPage />);

  // Verify loading state is shown
  expect(screen.getByText("Logging you in...")).toBeInTheDocument();

  // Wait for the redirect to happen
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});

test("redirects to home with error on authentication failure", async () => {
  // Mock the search params to include a code
  const mockSearchParams = useSearchParams();
  vi.mocked(mockSearchParams.get).mockImplementation((param) =>
    param === "code" ? "mock-auth-code" : null
  );

  // Mock the router
  const mockRouter = useRouter();
  const mockPush = vi.mocked(mockRouter.push);

  // Mock the fetch response for failed token exchange
  global.fetch = vi.fn().mockResolvedValue({
    json: vi.fn().mockResolvedValue({
      success: false,
      error: "Token exchange failed",
    }),
  });

  // Render the callback page
  render(<CallbackPage />);

  // Wait for the redirect to happen
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith("/?error=token_exchange_failed");
  });
});

test("redirects to home when no code is provided", async () => {
  // Mock the search params without a code
  const mockSearchParams = useSearchParams();
  vi.mocked(mockSearchParams.get).mockReturnValue(null);

  // Mock the router
  const mockRouter = useRouter();
  const mockPush = vi.mocked(mockRouter.push);

  // Render the callback page
  render(<CallbackPage />);

  // Wait for the redirect to happen
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith("/?error=no_code");
  });
});

test("redirects to home when error param is present", async () => {
  // Mock the search params with an error
  const mockSearchParams = useSearchParams();
  vi.mocked(mockSearchParams.get).mockImplementation((param) =>
    param === "error" ? "access_denied" : null
  );

  // Mock the router
  const mockRouter = useRouter();
  const mockPush = vi.mocked(mockRouter.push);

  // Render the callback page
  render(<CallbackPage />);

  // Wait for the redirect to happen
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith("/?error=authentication_failed");
  });
});
