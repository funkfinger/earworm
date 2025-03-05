import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchPage from "@/app/search/page";
import { expectColorScheme, expectAccentColor } from "../utils/styleTestUtils";

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
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        {...props}
        style={{ position: fill ? "absolute" : "relative" }}
      />
    );
  },
}));

// Mock the Playpen Sans font
jest.mock("next/font/google", () => ({
  Playpen_Sans: () => ({
    className: "font-playpen",
  }),
}));

describe("SearchPage", () => {
  it("renders the search page with all elements", () => {
    render(<SearchPage />);

    // Check for the heading
    expect(screen.getByText("What's stuck in your head?")).toBeInTheDocument();

    // Check for the worm mascot
    expect(screen.getByAltText("Worm Mascot")).toBeInTheDocument();

    // Check for the search input
    expect(
      screen.getByPlaceholderText("Search for a song or artist...")
    ).toBeInTheDocument();

    // Check for the search button
    expect(screen.getByText("Find My Earworm")).toBeInTheDocument();

    // Check for the placeholder card
    expect(
      screen.getByText(/This is a placeholder for the search screen/)
    ).toBeInTheDocument();
  });

  it("handles search input and submission", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    render(<SearchPage />);

    // Get the search input and button
    const searchInput = screen.getByPlaceholderText(
      "Search for a song or artist..."
    );
    const searchButton = screen.getByText("Find My Earworm");

    // Type in the search input
    fireEvent.change(searchInput, { target: { value: "test song" } });
    expect(searchInput).toHaveValue("test song");

    // Submit the form
    fireEvent.click(searchButton);

    // Check if console.log was called with the search query
    expect(consoleSpy).toHaveBeenCalledWith("Searching for:", "test song");

    // Clean up
    consoleSpy.mockRestore();
  });

  it("applies the correct color scheme and font styles", () => {
    render(<SearchPage />);

    // Check main container styles
    const mainContainer = screen.getByRole("main");
    expectColorScheme(mainContainer);

    // Check heading styles
    const heading = screen.getByText("What's stuck in your head?");
    expect(heading).toHaveClass("text-primary-foreground");
    expect(heading).toHaveClass("font-playpen");

    // Check accent text styles
    const accentText = screen.getByText((content: string) =>
      content.includes("Great! Now let's find that song")
    );
    expectAccentColor(accentText);

    // Check search input styles
    const searchInput = screen.getByPlaceholderText(
      "Search for a song or artist..."
    );
    expect(searchInput).toHaveClass("bg-accent-b/30");
    expect(searchInput).toHaveClass("border-secondary/20");
    expect(searchInput).toHaveClass("text-primary-foreground");
    expect(searchInput).toHaveClass("placeholder:text-accent-a");
    expect(searchInput).toHaveClass("font-playpen");

    // Check search button styles
    const searchButton = screen.getByText("Find My Earworm");
    expect(searchButton).toHaveClass("bg-secondary");
    expect(searchButton).toHaveClass("hover:bg-secondary-hover");
    expect(searchButton).toHaveClass("text-primary");
    expect(searchButton).toHaveClass("font-playpen");

    // Check card styles
    const card = screen
      .getByText((content: string) =>
        content.includes("This is a placeholder for the search screen")
      )
      .closest(".bg-accent-b\\/30");
    expect(card).toHaveClass("bg-accent-b/30");
    expect(card).toHaveClass("border-secondary/20");

    // Check card content styles
    const cardContent = screen.getByText((content: string) =>
      content.includes("This is a placeholder for the search screen")
    );
    expect(cardContent).toHaveClass("text-primary-foreground");
    expect(cardContent).toHaveClass("font-playpen");
  });
});
