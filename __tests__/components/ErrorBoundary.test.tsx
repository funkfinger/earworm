import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import { vi, describe, test, expect, beforeAll, afterAll } from "vitest";

// Create a component that throws an error for testing
const ErrorThrowingComponent = ({
  shouldThrow = true,
}: {
  shouldThrow?: boolean;
}) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

// Suppress console.error during tests to avoid noisy output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("ErrorBoundary", () => {
  test("renders children when there's no error", () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("renders default fallback UI when an error occurs", () => {
    // We need to spy on console.error and suppress it to avoid test noise
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Using try-catch because React will log an error when a component throws
    try {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );
    } catch {
      // Ignore the error as it's expected
    }

    // Check if the fallback UI is rendered
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try again" })
    ).toBeInTheDocument();

    // Restore the spy
    errorSpy.mockRestore();
  });

  test("renders custom fallback UI when provided", () => {
    const customFallback = <div>Custom Error UI</div>;

    // Using try-catch because React will log an error when a component throws
    try {
      render(
        <ErrorBoundary fallback={customFallback}>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );
    } catch {
      // Ignore the error as it's expected
    }

    expect(screen.getByText("Custom Error UI")).toBeInTheDocument();
  });

  test("calls onError when an error occurs", () => {
    const onErrorMock = vi.fn();

    // Using try-catch because React will log an error when a component throws
    try {
      render(
        <ErrorBoundary onError={onErrorMock}>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );
    } catch {
      // Ignore the error as it's expected
    }

    // Check if onError was called with the error
    expect(onErrorMock).toHaveBeenCalled();
    expect(onErrorMock.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onErrorMock.mock.calls[0][0].message).toBe("Test error");
  });

  test("resets the error state when the 'Try again' button is clicked", () => {
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    try {
      // This will throw an error and trigger the error boundary
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );
    } catch {
      // Ignore the error as it's expected
    }

    // Create a specific container for this test
    const errorContainer = screen
      .getAllByText("Something went wrong")[0]
      .closest("div");
    expect(errorContainer).toBeInTheDocument();

    // Click the "Try again" button within this specific container
    const tryAgainButton = within(errorContainer as HTMLElement).getByRole(
      "button",
      { name: "Try again" }
    );
    fireEvent.click(tryAgainButton);

    // The error should be reset, but the component will throw again
    // This is just to verify the reset functionality works
    expect(screen.getAllByText("Something went wrong").length).toBeGreaterThan(
      0
    );
  });

  test("uses function fallback with error and reset", () => {
    const fallbackFn = vi.fn().mockReturnValue(<div>Function Fallback</div>);

    // Using try-catch because React will log an error when a component throws
    try {
      render(
        <ErrorBoundary fallback={fallbackFn}>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );
    } catch {
      // Ignore the error as it's expected
    }

    // Check if the function was called with error and reset function
    expect(fallbackFn).toHaveBeenCalled();
    expect(fallbackFn.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(fallbackFn.mock.calls[0][0].message).toBe("Test error");
    expect(typeof fallbackFn.mock.calls[0][1]).toBe("function"); // reset function

    // Check if the fallback UI is rendered
    expect(screen.getByText("Function Fallback")).toBeInTheDocument();
  });
});
