import { render, screen, fireEvent, cleanup } from "@testing-library/react";
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
  vi.mocked(auth.initiateSpotifyLogin).mockResolvedValue(mockAuthResponse);

  const mockLoginFn = vi.fn();
  render(<SpotifyLoginButton onLogin={mockLoginFn} />);

  const button = screen.getByTestId("spotify-login-button");
  await fireEvent.click(button);

  expect(auth.initiateSpotifyLogin).toHaveBeenCalledTimes(1);
  expect(mockLoginFn).toHaveBeenCalledTimes(1);
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
  const mockError = "Failed to connect to Spotify";
  vi.mocked(auth.initiateSpotifyLogin).mockResolvedValue({
    success: false as const,
    error: mockError,
  });

  render(<SpotifyLoginButton />);

  const button = screen.getByTestId("spotify-login-button");
  await fireEvent.click(button);

  // Wait for the error message to appear
  const errorMessage = await screen.findByText("Failed to connect to Spotify");
  expect(errorMessage).toBeInTheDocument();
});
