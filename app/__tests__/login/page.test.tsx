import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "../../login/page";

// Mock the SpotifyLogin component
jest.mock("../../components/SpotifyLogin", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-spotify-login">Spotify Login Component</div>
  ),
}));

describe("LoginPage", () => {
  it("renders the login page with correct content", () => {
    render(<LoginPage />);

    // Check for the heading
    expect(screen.getByText("Connect with Spotify")).toBeInTheDocument();

    // Check for the explanation text
    expect(screen.getByText(/To help cure your earworm/)).toBeInTheDocument();

    // Check for the privacy notice
    expect(
      screen.getByText(/We only use your Spotify account/)
    ).toBeInTheDocument();

    // Check for the SpotifyLogin component
    expect(screen.getByTestId("mock-spotify-login")).toBeInTheDocument();
  });
});
