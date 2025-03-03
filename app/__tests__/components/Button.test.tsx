import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../../components/Button";

describe("Button Component", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-highlight"); // Primary variant class
    expect(button).not.toBeDisabled();
  });

  it("renders with secondary variant", () => {
    render(<Button variant="secondary">Secondary Button</Button>);

    const button = screen.getByRole("button", { name: /secondary button/i });
    expect(button).toHaveClass("bg-accent-b"); // Secondary variant class
  });

  it("renders as disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);

    const button = screen.getByRole("button", { name: /clickable button/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick handler when Enter key is pressed", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Keyboard Button</Button>);

    const button = screen.getByRole("button", { name: /keyboard button/i });
    fireEvent.keyDown(button, { key: "Enter" });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick handler when Space key is pressed", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Keyboard Button</Button>);

    const button = screen.getByRole("button", { name: /keyboard button/i });
    fireEvent.keyDown(button, { key: " " });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>);

    const button = screen.getByRole("button", { name: /custom button/i });
    expect(button).toHaveClass("custom-class");
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<Button size="sm">Small Button</Button>);

    let button = screen.getByRole("button", { name: /small button/i });
    expect(button).toHaveClass("px-3 py-1.5 text-sm");

    rerender(<Button size="lg">Large Button</Button>);
    button = screen.getByRole("button", { name: /large button/i });
    expect(button).toHaveClass("px-6 py-3 text-lg");
  });

  it("renders with an icon", () => {
    render(
      <Button icon={<span data-testid="test-icon">🔍</span>}>
        Icon Button
      </Button>
    );

    const icon = screen.getByTestId("test-icon");
    expect(icon).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /icon button/i })
    ).toContainElement(icon);
  });

  it("renders as full width when fullWidth is true", () => {
    render(<Button fullWidth>Full Width Button</Button>);

    const button = screen.getByRole("button", { name: /full width button/i });
    expect(button).toHaveClass("w-full");
  });
});
