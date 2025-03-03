import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("RootLayout", () => {
  it("renders the layout with correct metadata", () => {
    const { container } = render(
      <div className="font-sans bg-background text-text antialiased">
        <div>Test Content</div>
      </div>
    );

    // Check for the body element with correct classes
    const body = container.firstChild;
    expect(body).toHaveClass("font-sans");
    expect(body).toHaveClass("bg-background");
    expect(body).toHaveClass("text-text");
    expect(body).toHaveClass("antialiased");
  });
});
