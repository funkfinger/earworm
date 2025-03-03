import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import WelcomeScreen from "@/app/components/WelcomeScreen";
import SpotifyLogin from "@/app/components/SpotifyLogin";
import SearchPage from "@/app/search/page";
import { useRouter } from "next/navigation";

// Mock the Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
  }) => (
    <img
      src={src}
      alt={alt}
      {...props}
      style={{ position: fill ? "absolute" : "relative" }}
    />
  ),
}));

describe("Complete User Flow", () => {
  const mockPush = jest.fn();
  const mockLocation = {
    href: "http://localhost/",
    assign: jest.fn(),
  } as unknown as Location;

  beforeEach(() => {
    // Setup the router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Setup window.location mock
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("completes the full user journey from welcome to search", async () => {
    // Step 1: Welcome Screen
    render(<WelcomeScreen />);

    // Verify welcome screen content
    expect(screen.getByText("Welcome to De Worm!")).toBeInTheDocument();
    expect(screen.getByText("Let's Get Started!")).toBeInTheDocument();

    // Click get started button
    fireEvent.click(screen.getByText("Let's Get Started!"));
    expect(mockPush).toHaveBeenCalledWith("/login");

    // Step 2: Spotify Login
    render(<SpotifyLogin />);

    // Verify login screen content
    expect(screen.getByText("Connect to Spotify")).toBeInTheDocument();
    expect(screen.getByText("Connect with Spotify")).toBeInTheDocument();

    // Click connect button
    fireEvent.click(screen.getByText("Connect with Spotify"));
    expect(window.location.assign).toHaveBeenCalledWith("/api/auth/spotify");

    // Step 3: Search Page
    render(<SearchPage />);

    // Verify search page content
    expect(screen.getByText("Search for Your Earworm")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter song name, artist, or lyrics...")
    ).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();

    // Test search functionality
    const searchInput = screen.getByPlaceholderText(
      "Enter song name, artist, or lyrics..."
    );
    const searchButton = screen.getByText("Search");

    fireEvent.change(searchInput, { target: { value: "test song" } });
    expect(searchInput).toHaveValue("test song");

    fireEvent.click(searchButton);

    // Verify placeholder message
    expect(
      screen.getByText(/This is a placeholder for the search screen/)
    ).toBeInTheDocument();
  });

  it("handles errors gracefully during the user flow", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Test Spotify login error
    window.location.assign = jest.fn().mockImplementation(() => {
      throw new Error("Spotify connection failed");
    });

    render(<SpotifyLogin />);
    fireEvent.click(screen.getByText("Connect with Spotify"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to initiate Spotify login:",
        expect.any(Error)
      );
    });

    // Clean up
    consoleSpy.mockRestore();
  });
});
