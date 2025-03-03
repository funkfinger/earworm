import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import WelcomeScreen from "../../components/WelcomeScreen";
import { useRouter } from "next/navigation";

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
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={props.src || ""} />;
  },
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

    // Check for the heading
    expect(screen.getByText("Welcome to De Worm!")).toBeInTheDocument();

    // Check for QT mascot image
    expect(screen.getByAltText("QT Mascot")).toBeInTheDocument();

    // Check for welcome text - using more specific selectors to handle apostrophes
    expect(
      screen.getByText((content) => content.includes("Hi there!"))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("QT"))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes("Got a song stuck in your head")
      )
    ).toBeInTheDocument();
  });

  it("navigates to login page when button is clicked", () => {
    render(<WelcomeScreen />);

    // Find and click the button
    const button = screen.getByText((content) =>
      content.includes("Get Started")
    );
    fireEvent.click(button);

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
