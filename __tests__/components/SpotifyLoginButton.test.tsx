import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { expect, test, vi, beforeEach } from "vitest";
import SpotifyLoginButton from "@/app/components/SpotifyLoginButton";
import * as auth from "@/app/actions/auth";

// Mock the auth module
vi.mock("@/app/actions/auth", () => ({
  initiateSpotifyLogin: vi.fn(),
}));

beforeEach(() => {
  cleanup();
  // Reset all mocks before each test
  vi.resetAllMocks();
});

test("renders Spotify login button", () => {
  render(<SpotifyLoginButton />);

  const button = screen.getByTestId("spotify-login-button");
  expect(button).toBeInTheDocument();

  // Check for Spotify branding
  expect(button).toHaveClass("bg-[#1DB954]"); // Spotify green
  expect(screen.getByTestId("spotify-icon")).toBeInTheDocument();
});

test("handles click event", async () => {
  // Mock successful auth response with explicit type
  const mockAuthResponse = {
    success: true as const,
    url: "https://spotify.com/auth",
  };

  // Setup the mock to return a promise that we can control
  const authPromise = Promise.resolve(mockAuthResponse);
  vi.mocked(auth.initiateSpotifyLogin).mockReturnValue(authPromise);

  const mockLoginFn = vi.fn();
  render(<SpotifyLoginButton onLogin={mockLoginFn} />);

  const button = screen.getByTestId("spotify-login-button");

  // Click the button and wait for loading state
  fireEvent.click(button);
  await waitFor(() => {
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  // Wait for the auth promise to resolve
  await authPromise;

  // Verify the final state
  await waitFor(() => {
    expect(auth.initiateSpotifyLogin).toHaveBeenCalledTimes(1);
    expect(mockLoginFn).toHaveBeenCalledTimes(1);
    expect(mockLoginFn).toHaveBeenCalledWith(mockAuthResponse);
  });

  // Verify the button is still visible (since navigation is prevented in test)
  expect(button).toBeInTheDocument();
  expect(button).not.toBeDisabled();
});

test("shows loading state when isLoading is true", () => {
  render(<SpotifyLoginButton isLoading={true} />);

  expect(screen.getByTestId("spotify-login-button")).toBeDisabled();
  expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
});

test("shows error state when hasError is true", () => {
  render(
    <SpotifyLoginButton hasError={true} errorMessage="Failed to connect" />
  );

  const button = screen.getByRole("button", { name: /try again/i });
  expect(button).toBeInTheDocument();
  expect(screen.getByText("Failed to connect")).toBeInTheDocument();
});

test("handles auth failure", async () => {
  // Mock failed auth response
  const mockError = "Missing Spotify client ID";
  const authPromise = Promise.resolve({
    success: false as const,
    error: mockError,
  });
  vi.mocked(auth.initiateSpotifyLogin).mockReturnValue(authPromise);

  render(<SpotifyLoginButton />);

  const button = screen.getByTestId("spotify-login-button");
  fireEvent.click(button);

  // Wait for loading state
  await waitFor(() => {
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  // Wait for the auth promise to resolve
  await authPromise;

  // Wait for error state
  await waitFor(() => {
    const errorMessage = screen.getByText(mockError);
    expect(errorMessage).toBeInTheDocument();
    expect(button).toHaveTextContent("Try Again");
    expect(button).toHaveClass("bg-red-500");
  });
});
