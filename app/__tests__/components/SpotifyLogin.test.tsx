import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SpotifyLogin from "@/app/components/SpotifyLogin";

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
    style?: React.CSSProperties;
  }) => (
    <img
      src={src}
      alt={alt}
      {...props}
      style={{
        ...(props.style || {}),
        position: fill ? "absolute" : "relative",
      }}
    />
  ),
}));

describe("SpotifyLogin", () => {
  interface MockLocation {
    href: string;
    assign: jest.Mock;
  }

  const mockLocation: MockLocation = {
    href: "http://localhost/",
    assign: jest.fn(),
  };

  beforeEach(() => {
    // Reset window.location mock before each test
    delete (window as { location?: Location }).location;
    window.location = mockLocation as unknown as Location;
  });

  it("renders the Spotify login button with logo", () => {
    render(<SpotifyLogin />);

    // Check for the heading
    expect(screen.getByText("Connect to Spotify")).toBeInTheDocument();

    // Check for the description
    expect(
      screen.getByText("Link your Spotify account to get started")
    ).toBeInTheDocument();

    // Check for the Spotify logo
    expect(screen.getByAltText("Spotify Logo")).toBeInTheDocument();

    // Check for the connect button
    expect(screen.getByText("Connect with Spotify")).toBeInTheDocument();

    // Check for the terms text (using a more flexible matcher)
    expect(
      screen.getByText((content) =>
        content.includes("By connecting, you agree to our")
      )
    ).toBeInTheDocument();
  });

  it("navigates to Spotify auth when connect button is clicked", () => {
    render(<SpotifyLogin />);

    // Find and click the connect button
    const button = screen.getByText("Connect with Spotify");
    fireEvent.click(button);

    // Check if window.location.assign was called with the correct URL
    expect(window.location.assign).toHaveBeenCalledWith("/api/auth/spotify");
  });

  it("handles click errors gracefully", () => {
    // Mock console.error to prevent test output noise
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Mock window.location.assign to throw an error
    window.location.assign = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });

    render(<SpotifyLogin />);

    // Find and click the connect button
    const connectButton = screen.getByText("Connect with Spotify");
    fireEvent.click(connectButton);

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to initiate Spotify login:",
      expect.any(Error)
    );

    // Clean up
    consoleSpy.mockRestore();
  });
});
