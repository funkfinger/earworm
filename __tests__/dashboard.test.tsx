import { test, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Dashboard from "../app/dashboard/page";
import React from "react";
import ErrorBoundary from "../app/components/ErrorBoundary";

// Mock the next/navigation module
vi.mock("next/navigation", () => {
  const mockRouter = {
    push: vi.fn(),
  };
  return {
    useRouter: () => mockRouter,
  };
});

// Mock the next/image component
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

// Mock the Spotify API
vi.mock("../app/lib/spotify/api", () => ({
  getAccessToken: vi.fn().mockResolvedValue("mock-token"),
  searchTracks: vi.fn().mockResolvedValue([]),
  addTrackToDeWormPlaylist: vi.fn().mockResolvedValue({}),
}));

import { useRouter } from "next/navigation";
import { getAccessToken, searchTracks } from "../app/lib/spotify/api";

// Mock console.error to prevent test output noise
const originalConsoleError = console.error;
beforeEach(() => {
  vi.resetAllMocks();

  // Reset fetch mock
  global.fetch = vi.fn();

  // Mock console.error to prevent test noise
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

test("redirects to home page when user is not authenticated", async ({
  expect,
}) => {
  // Mock the router
  const mockRouter = useRouter();
  const mockPush = vi.mocked(mockRouter.push);

  // Mock the fetch response for unauthenticated user
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({
      success: false,
      error: "Not authenticated",
    }),
  });

  // Render the dashboard page
  render(<Dashboard />);

  // Verify loading state is shown initially
  expect(screen.getByText("Loading your experience...")).toBeInTheDocument();

  // Wait for the redirect to happen
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});

test("displays dashboard content for authenticated user", async ({
  expect,
}) => {
  // Mock the fetch response for authenticated user
  const mockUser = {
    display_name: "Test User",
    images: [{ url: "https://example.com/avatar.jpg" }],
  };

  global.fetch = vi.fn().mockImplementation((url) => {
    if (url === "/api/auth/me") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });

  // Clear any previous renders
  document.body.innerHTML = "";

  // Render the dashboard page
  const { container } = render(<Dashboard />);

  // Wait for the dashboard content to load
  await waitFor(() => {
    expect(
      screen.queryByText("Loading your experience...")
    ).not.toBeInTheDocument();
  });

  // Verify dashboard elements are displayed
  await waitFor(() => {
    // Check for welcome message with user name
    const welcomeHeading = container.querySelector("h2.text-yellow-300");
    expect(welcomeHeading).toBeInTheDocument();
    expect(welcomeHeading?.textContent).toContain(
      `Welcome, ${mockUser.display_name}!`
    );

    // Check for QT mascot
    const mascotImg = container.querySelector(
      'div.w-48.h-48 img[alt="QT Mascot"]'
    );
    expect(mascotImg).toBeInTheDocument();

    // Check for search input
    const searchInput = container.querySelector("input#song-search");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput?.getAttribute("placeholder")).toBe(
      "Type song title or artist..."
    );

    // Check for search button
    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });
});

test("handles search functionality", async ({ expect }) => {
  // Mock the track search results
  const mockTracks = [
    {
      id: "track1",
      name: "Test Track",
      artists: [{ name: "Test Artist" }],
      album: {
        name: "Test Album",
        images: [{ url: "https://example.com/album.jpg" }],
      },
      external_urls: {
        spotify: "https://open.spotify.com/track/123",
      },
    },
  ];

  // Mock the user fetch
  const mockUser = {
    display_name: "Test User",
    images: [{ url: "https://example.com/avatar.jpg" }],
  };

  // Mock fetch for different endpoints
  global.fetch = vi.fn().mockImplementation((url) => {
    if (url === "/api/auth/me") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });
    }
    if (url === "/api/auth/token") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "mock-token" }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });

  // Mock the Spotify API search function
  vi.mocked(getAccessToken).mockResolvedValue("mock-token");
  vi.mocked(searchTracks).mockResolvedValue(mockTracks);

  // Clear any previous renders
  document.body.innerHTML = "";

  // Render the dashboard
  render(<Dashboard />);

  // Wait for the dashboard to load
  await waitFor(() => {
    expect(
      screen.queryByText("Loading your experience...")
    ).not.toBeInTheDocument();
  });

  // Type in the search box
  const searchInput = screen.getByPlaceholderText(
    "Type song title or artist..."
  ) as HTMLInputElement;
  expect(searchInput).toBeInTheDocument();
  fireEvent.change(searchInput, { target: { value: "test query" } });

  // Click the search button
  const searchButton = screen.getByRole("button", {
    name: /search/i,
  }) as HTMLButtonElement;
  expect(searchButton).toBeInTheDocument();
  fireEvent.click(searchButton);

  // Wait for search results to be displayed
  await waitFor(() => {
    expect(screen.getByText("Test Track")).toBeInTheDocument();
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
  });
});

// New test for ErrorBoundary fallback UI
test("shows ErrorBoundary fallback UI when a rendering error occurs", async ({
  expect,
}) => {
  // Mock the router
  const mockRouter = useRouter();
  const mockPush = vi.mocked(mockRouter.push);

  // Mock the user fetch to simulate successful authentication
  const mockUser = {
    display_name: "Test User",
    images: [{ url: "https://example.com/avatar.jpg" }],
  };

  global.fetch = vi.fn().mockImplementation((url) => {
    if (url === "/api/auth/me") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, user: mockUser }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });

  // Create a component that will throw an error when rendered inside ErrorBoundary
  const ErrorThrowingComponent = () => {
    throw new Error("Test error in Dashboard");
  };

  // Directly render the ErrorBoundary with our error component to test the fallback
  render(
    <ErrorBoundary
      fallback={(error, reset) => (
        <div>
          <h2>Dashboard Error</h2>
          <p>{error.message}</p>
          <button data-testid="dashboard-error-reset-button" onClick={reset}>
            Try Again
          </button>
          <button onClick={() => mockRouter.push("/")}>Return to Home</button>
        </div>
      )}
    >
      <ErrorThrowingComponent />
    </ErrorBoundary>
  );

  // Check if the fallback UI is rendered
  await waitFor(() => {
    expect(screen.getByText("Dashboard Error")).toBeInTheDocument();
    expect(screen.getByText("Test error in Dashboard")).toBeInTheDocument();
    expect(
      screen.getByTestId("dashboard-error-reset-button")
    ).toBeInTheDocument();
  });

  // Test the "Return to Home" button
  fireEvent.click(screen.getByText("Return to Home"));
  expect(mockPush).toHaveBeenCalledWith("/");
});
