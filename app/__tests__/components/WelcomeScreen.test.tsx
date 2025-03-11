import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import WelcomeScreen from "../../components/WelcomeScreen";
import { useRouter } from "next/navigation";
import {
  expectColorScheme,
  expectHighlightColor,
  expectAccentColor,
} from "../utils/styleTestUtils";

// Mock the Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Define a type for the Image component props
type ImageProps = {
  src?: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
  [key: string]: string | number | boolean | undefined;
};

// Mock the Image component from next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImageProps) => {
    const { fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img {...rest} style={{ position: fill ? "absolute" : "relative" }} />
    );
  },
}));

// Mock the Playpen Sans font
jest.mock("next/font/google", () => ({
  Playpen_Sans: () => ({
    className: "font-playpen",
  }),
}));

describe("WelcomeScreen", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Setup the router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the welcome screen with QT mascot", () => {
    render(<WelcomeScreen />);

    // Check for app name
    expect(screen.getByText("De Worm")).toBeInTheDocument();

    // Check for QT mascot image
    expect(screen.getByAltText("QT Mascot")).toBeInTheDocument();

    // Check for tagline
    expect(screen.getByText("Your Earworm Cure")).toBeInTheDocument();
  });

  it("navigates to login page when button is clicked", () => {
    render(<WelcomeScreen />);

    // Find and click the button
    const button = screen.getByText((content: string) =>
      content.includes("Get Started")
    );
    fireEvent.click(button);

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("applies the correct color scheme and font styles", () => {
    render(<WelcomeScreen />);

    // Check main container styles
    const mainContainer = screen.getByRole("main");
    expectColorScheme(mainContainer);

    // Check heading styles
    const heading = screen.getByText("Welcome to De Worm!");
    expect(heading).toHaveClass("text-primary-foreground");
    expect(heading).toHaveClass("font-playpen");

    // Check highlight text styles
    const highlightText = screen.getByText("QT");
    expectHighlightColor(highlightText);

    // Check accent text styles
    const accentText = screen.getByText((content: string) =>
      content.includes("Got a song stuck in your head")
    );
    expectAccentColor(accentText);

    // Check card styles
    const card = screen
      .getByText((content: string) =>
        content.includes("We'll need to connect to your Spotify account")
      )
      .closest(".bg-accent-b\\/30");
    expect(card).toHaveClass("bg-accent-b/30");
    expect(card).toHaveClass("border-secondary/20");

    // Check card content styles
    const cardContent = screen.getByText((content: string) =>
      content.includes("We'll need to connect to your Spotify account")
    );
    expect(cardContent).toHaveClass("text-primary-foreground");
    expect(cardContent).toHaveClass("font-playpen");

    // Check button styles
    const button = screen.getByText("Let's Get Started!");
    expect(button).toHaveClass("bg-secondary");
    expect(button).toHaveClass("hover:bg-secondary-hover");
    expect(button).toHaveClass("text-primary");
    expect(button).toHaveClass("font-playpen");
  });
});
