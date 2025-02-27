"use client";

import { useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

/**
 * A component that demonstrates how to use the ErrorBoundary component.
 * This component has a button that triggers an error when clicked.
 */
export default function ErrorBoundaryExample() {
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-pink-400 mb-4">
        Error Boundary Example
      </h2>

      <div className="space-y-6">
        {/* Basic usage */}
        <div className="p-4 bg-[#3C2218] rounded-lg">
          <h3 className="text-lg font-medium text-yellow-300 mb-2">
            Basic Error Boundary
          </h3>
          <ErrorBoundary>
            <ErrorProneComponent />
          </ErrorBoundary>
        </div>

        {/* Custom fallback UI */}
        <div className="p-4 bg-[#3C2218] rounded-lg">
          <h3 className="text-lg font-medium text-yellow-300 mb-2">
            Custom Fallback UI
          </h3>
          <ErrorBoundary
            fallback={
              <div className="p-4 bg-purple-900/50 border border-purple-500 rounded-lg text-white">
                <p className="text-purple-200">A custom error message!</p>
              </div>
            }
          >
            <ErrorProneComponent />
          </ErrorBoundary>
        </div>

        {/* Function fallback */}
        <div className="p-4 bg-[#3C2218] rounded-lg">
          <h3 className="text-lg font-medium text-yellow-300 mb-2">
            Function Fallback with Error Details
          </h3>
          <ErrorBoundary
            fallback={(error, reset) => (
              <div className="p-4 bg-blue-900/50 border border-blue-500 rounded-lg text-white">
                <h4 className="text-lg font-medium text-blue-300 mb-2">
                  Something went wrong
                </h4>
                <p className="text-blue-200 mb-2">
                  Error message: {error.message}
                </p>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
            )}
          >
            <ErrorProneComponent />
          </ErrorBoundary>
        </div>

        {/* Error logging */}
        <div className="p-4 bg-[#3C2218] rounded-lg">
          <h3 className="text-lg font-medium text-yellow-300 mb-2">
            With Error Logging
          </h3>
          <ErrorBoundary
            onError={(error, errorInfo) => {
              // In a real app, you would send this to your error tracking service
              console.log("Logged error:", error);
              console.log("Component stack:", errorInfo.componentStack);
            }}
          >
            <ErrorProneComponent />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

/**
 * A component that can trigger an error when a button is clicked.
 */
function ErrorProneComponent() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    throw new Error("This is a simulated error!");
  }

  return (
    <div className="p-4 bg-[#2A1810] rounded-lg">
      <p className="text-yellow-100 mb-3">
        This component will throw an error when the button is clicked.
      </p>
      <button
        onClick={() => setHasError(true)}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
      >
        Trigger Error
      </button>
    </div>
  );
}
