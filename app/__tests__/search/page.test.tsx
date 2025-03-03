import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchPage from "../../search/page";

// Mock the Image component from next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: {
    src: string;
    alt: string;
    className?: string;
    fill?: boolean;
    priority?: boolean;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={props.src || ""} />;
  },
}));

describe("SearchPage", () => {
  it("renders the search page with correct content", () => {
    render(<SearchPage />);

    // Check for the heading
    expect(screen.getByText("Search for Your Earworm")).toBeInTheDocument();

    // Check for the QT mascot
    expect(screen.getByAltText("QT Mascot")).toBeInTheDocument();

    // Check for the explanation text
    expect(
      screen.getByText(/Great! Now let's find that song/)
    ).toBeInTheDocument();

    // Check for the placeholder message
    expect(
      screen.getByText(/This is a placeholder for the search screen/)
    ).toBeInTheDocument();
  });
});
