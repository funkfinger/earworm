import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

// Extend the global Window interface
declare global {
  interface Window {
    location: Location;
  }
}

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill,
    priority,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement("img", {
      src,
      alt,
      ...props,
      style: { position: fill ? "absolute" : "relative" },
      priority: priority ? "true" : undefined,
    });
  },
}));

// Export testing utilities
export { render, screen, fireEvent, waitFor };
