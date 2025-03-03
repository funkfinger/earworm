import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RootLayout from "@/app/layout";

// Mock the Playpen Sans font
jest.mock("next/font/google", () => ({
  Playpen_Sans: () => ({
    className: "font-playpen",
  }),
}));

describe("RootLayout", () => {
  it("renders the layout with correct metadata", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    // Check for the body element with correct classes
    const body = document.body;
    expect(body).toHaveClass("font-playpen");
    expect(body).toHaveClass("bg-background");
    expect(body).toHaveClass("text-text");
    expect(body).toHaveClass("antialiased");

    // Check that children are rendered
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
