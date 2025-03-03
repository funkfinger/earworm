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
    priority,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
  }) => (
    <img
      src={src}
      alt={alt}
      {...props}
      style={{ ...props.style, position: fill ? "absolute" : "relative" }}
    />
  ),
}));

describe("SpotifyLogin", () => {
  const mockLocation = {
    href: "http://localhost/",
    assign: jest.fn(),
  };

  beforeEach(() => {
    // Reset window.location mock before each test
    delete (window as any).location;
    window.location = mockLocation as any;
  });

  it("renders the Spotify login button with logo", () => {
    render(<SpotifyLogin />);

    // Check for the Spotify logo
    expect(screen.getByAltText("Spotify Logo")).toBeInTheDocument();

    // Check for the connect button
    expect(screen.getByText("Connect with Spotify")).toBeInTheDocument();

    // Check for the terms text
    expect(
      screen.getByText(/By connecting, you agree to our Terms/)
    ).toBeInTheDocument();
  });

  it("redirects to Spotify auth endpoint when button is clicked", () => {
    render(<SpotifyLogin />);

    // Find and click the connect button
    const connectButton = screen.getByText("Connect with Spotify");
    fireEvent.click(connectButton);

    // Check if we're redirected to the Spotify auth endpoint
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
