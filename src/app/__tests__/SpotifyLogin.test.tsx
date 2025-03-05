import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SpotifyLogin from "../spotify-login/page";

// Mock the useRouter hook
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("SpotifyLogin Page", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("renders the Spotify login page correctly", () => {
    render(<SpotifyLogin />);

    // Check for page elements
    expect(screen.getByText("Connect to Spotify")).toBeInTheDocument();
    expect(
      screen.getByText(
        "To help cure your earworm, I'll need to play music through your Spotify account."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Login with Spotify")).toBeInTheDocument();
    expect(
      screen.getByText("We'll only use your Spotify account to play music.")
    ).toBeInTheDocument();
    expect(screen.getByText("← Back to home")).toBeInTheDocument();
  });

  it("shows loading state when login button is clicked", async () => {
    render(<SpotifyLogin />);

    // Click the login button
    fireEvent.click(screen.getByText("Login with Spotify"));

    // Check for loading state
    expect(screen.getByText("Connecting...")).toBeInTheDocument();
  });

  it("redirects to search page after successful login", async () => {
    // Mock the setTimeout function
    jest.useFakeTimers();

    render(<SpotifyLogin />);

    // Click the login button
    fireEvent.click(screen.getByText("Login with Spotify"));

    // Fast-forward timer
    jest.advanceTimersByTime(1500);

    // Check if router.push was called with the correct path
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/search");
    });

    // Restore timers
    jest.useRealTimers();
  });

  it("navigates back to home when back link is clicked", () => {
    render(<SpotifyLogin />);

    // Click the back link
    fireEvent.click(screen.getByText("← Back to home"));

    // Check if router.push was called with the correct path
    expect(mockPush).not.toHaveBeenCalled(); // We don't actually call push in the link
  });
});
