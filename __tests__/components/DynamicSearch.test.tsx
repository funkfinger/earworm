import { test, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DynamicSearch from "../../app/components/DynamicSearch";
import { searchTracks, getAccessToken } from "../../app/lib/spotify/api";

// Mock the Spotify API
vi.mock("../../app/lib/spotify/api", () => ({
  getAccessToken: vi.fn().mockResolvedValue("mock-token"),
  searchTracks: vi.fn().mockResolvedValue([]),
}));

// Override the debounceStringInput function in the DynamicSearch component
// This is done by adding a property to the window object that the component can check
beforeEach(() => {
  vi.resetAllMocks();

  // Make debounced functions execute immediately in tests
  // @ts-expect-error - Adding a test helper property to window
  window.__TEST_IMMEDIATE_DEBOUNCE = true;

  // Ensure getAccessToken returns a token
  vi.mocked(getAccessToken).mockResolvedValue("mock-token");

  // Clear any previous renders
  document.body.innerHTML = "";
});

// Clean up after tests
afterEach(() => {
  // @ts-expect-error - Removing test helper property
  delete window.__TEST_IMMEDIATE_DEBOUNCE;
});

test("shows helper text when typing less than 3 characters", async ({
  expect,
}) => {
  const handleSelectTrack = vi.fn();
  const handleError = vi.fn();

  render(
    <DynamicSearch onSelectTrack={handleSelectTrack} onError={handleError} />
  );

  // Get the search input
  const searchInput = screen.getByTestId(
    "song-search-input"
  ) as HTMLInputElement;
  expect(searchInput).toBeInTheDocument();

  // Type 2 characters (should not trigger search)
  fireEvent.change(searchInput, { target: { value: "te" } });

  // Verify the helper text is shown
  expect(screen.getByTestId("search-helper-text")).toBeInTheDocument();
  expect(
    screen.getByText("Type at least 3 characters to search")
  ).toBeInTheDocument();

  // Verify search was not called
  expect(searchTracks).not.toHaveBeenCalled();
});

test("triggers search when typing 3 or more characters", async ({ expect }) => {
  const handleSelectTrack = vi.fn();
  const handleError = vi.fn();

  // Mock search results
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
      preview_url: "https://example.com/preview.mp3",
    },
  ];

  // Mock the searchTracks function to return our mock data
  vi.mocked(searchTracks).mockResolvedValue(mockTracks);

  render(
    <DynamicSearch onSelectTrack={handleSelectTrack} onError={handleError} />
  );

  // Get the search input
  const searchInput = screen.getByTestId(
    "song-search-input"
  ) as HTMLInputElement;

  // Type 3 characters to trigger search
  fireEvent.change(searchInput, { target: { value: "tes" } });

  // Wait for the search to be triggered
  await waitFor(() => {
    expect(searchTracks).toHaveBeenCalledWith("tes", "mock-token");
  });

  // Wait for search results to be displayed
  await waitFor(() => {
    expect(screen.getByTestId("search-results-dropdown")).toBeInTheDocument();
  });
});

test("selects a track from search results", async ({ expect }) => {
  const handleSelectTrack = vi.fn();
  const handleError = vi.fn();

  // Mock search results
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
      preview_url: "https://example.com/preview.mp3",
    },
  ];

  // Mock the searchTracks function to return our mock data
  vi.mocked(searchTracks).mockResolvedValue(mockTracks);

  render(
    <DynamicSearch onSelectTrack={handleSelectTrack} onError={handleError} />
  );

  // Get the search input
  const searchInput = screen.getByTestId(
    "song-search-input"
  ) as HTMLInputElement;

  // Type to trigger search
  fireEvent.change(searchInput, { target: { value: "test" } });

  // Wait for the search to be triggered
  await waitFor(() => {
    expect(searchTracks).toHaveBeenCalledWith("test", "mock-token");
  });

  // Wait for search results to be displayed
  await waitFor(() => {
    expect(screen.getByTestId("search-results-dropdown")).toBeInTheDocument();
  });

  // Find and click on a track result
  // Note: We need to update TrackSearchResults to include test IDs for better testing
  const trackElement = await screen.findByText("Test Track");
  fireEvent.click(trackElement);

  // Verify the onSelectTrack callback was called with the correct track
  expect(handleSelectTrack).toHaveBeenCalledWith(mockTracks[0]);
});

test("handles search errors", async ({ expect }) => {
  const handleSelectTrack = vi.fn();
  const handleError = vi.fn();

  // Mock search error
  const mockError = new Error("API error");
  vi.mocked(searchTracks).mockRejectedValue(mockError);

  render(
    <DynamicSearch onSelectTrack={handleSelectTrack} onError={handleError} />
  );

  // Get the search input
  const searchInput = screen.getByTestId(
    "song-search-input"
  ) as HTMLInputElement;

  // Type to trigger search
  fireEvent.change(searchInput, { target: { value: "test" } });

  // Wait for the error to be handled
  await waitFor(() => {
    expect(handleError).toHaveBeenCalledWith("API error");
  });

  // Check for error message in the component
  await waitFor(() => {
    expect(screen.getByTestId("search-error-text")).toBeInTheDocument();
    expect(screen.getByText("API error")).toBeInTheDocument();
  });
});

test("clears search input after selecting a track", async ({ expect }) => {
  const handleSelectTrack = vi.fn();
  const handleError = vi.fn();

  // Mock search results
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
      preview_url: "https://example.com/preview.mp3",
    },
  ];

  // Mock the searchTracks function to return our mock data
  vi.mocked(searchTracks).mockResolvedValue(mockTracks);

  render(
    <DynamicSearch onSelectTrack={handleSelectTrack} onError={handleError} />
  );

  // Get the search input
  const searchInput = screen.getByTestId(
    "song-search-input"
  ) as HTMLInputElement;

  // Type to trigger search
  fireEvent.change(searchInput, { target: { value: "test" } });

  // Wait for search results to be displayed
  await waitFor(() => {
    expect(screen.getByTestId("search-results-dropdown")).toBeInTheDocument();
  });

  // Find and click on a track result
  const trackElement = await screen.findByText("Test Track");
  fireEvent.click(trackElement);

  // Verify the input was cleared
  expect(searchInput.value).toBe("");
});
