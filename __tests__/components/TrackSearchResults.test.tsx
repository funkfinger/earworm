import { test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TrackSearchResults from "../../app/components/TrackSearchResults";

// Mock the HTMLMediaElement API
beforeEach(() => {
  // Mock the HTMLMediaElement methods
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();

  // Mock the src setter
  Object.defineProperty(window.HTMLMediaElement.prototype, "src", {
    get: vi.fn().mockReturnValue(""),
    set: vi.fn(),
  });

  // Clear any previous renders
  document.body.innerHTML = "";
});

// Sample track data for testing
const mockTracks = [
  {
    id: "track1",
    name: "Test Track 1",
    artists: [{ name: "Test Artist 1" }],
    album: {
      name: "Test Album 1",
      images: [{ url: "https://example.com/album1.jpg" }],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/123",
    },
    preview_url: "https://example.com/preview1.mp3",
  },
  {
    id: "track2",
    name: "Test Track 2",
    artists: [{ name: "Test Artist 2" }],
    album: {
      name: "Test Album 2",
      images: [{ url: "https://example.com/album2.jpg" }],
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/456",
    },
    preview_url: null, // No preview URL for this track
  },
];

test("renders loading state correctly", async ({ expect }) => {
  render(
    <TrackSearchResults tracks={[]} onSelectTrack={vi.fn()} isLoading={true} />
  );

  expect(screen.getByTestId("search-loading")).toBeInTheDocument();
});

test("renders no results message when tracks array is empty", async ({
  expect,
}) => {
  render(
    <TrackSearchResults tracks={[]} onSelectTrack={vi.fn()} isLoading={false} />
  );

  expect(screen.getByTestId("no-results-message")).toBeInTheDocument();
  expect(
    screen.getByText("No tracks found. Try a different search term.")
  ).toBeInTheDocument();
});

test("renders track list correctly", async ({ expect }) => {
  render(
    <TrackSearchResults
      tracks={mockTracks}
      onSelectTrack={vi.fn()}
      isLoading={false}
    />
  );

  // Check if both tracks are rendered
  expect(
    screen.getByTestId(`track-result-${mockTracks[0].id}`)
  ).toBeInTheDocument();
  expect(
    screen.getByTestId(`track-result-${mockTracks[1].id}`)
  ).toBeInTheDocument();

  // Check track names
  expect(screen.getByText("Test Track 1")).toBeInTheDocument();
  expect(screen.getByText("Test Track 2")).toBeInTheDocument();

  // Check artist names
  expect(screen.getByText("Test Artist 1")).toBeInTheDocument();
  expect(screen.getByText("Test Artist 2")).toBeInTheDocument();
});

test("shows 'Preview not available' for tracks without preview URLs", async ({
  expect,
}) => {
  render(
    <TrackSearchResults
      tracks={mockTracks}
      onSelectTrack={vi.fn()}
      isLoading={false}
    />
  );

  // Check if the "Preview not available" message is shown for the second track
  expect(screen.getByText("Preview not available")).toBeInTheDocument();

  // Check that play button is not rendered for the track without preview URL
  const track2Element = screen.getByTestId(`track-result-${mockTracks[1].id}`);
  expect(track2Element.querySelector("button")).toBeNull();
});

test("shows play button for tracks with preview URLs", async ({ expect }) => {
  render(
    <TrackSearchResults
      tracks={mockTracks}
      onSelectTrack={vi.fn()}
      isLoading={false}
    />
  );

  // Check if play button is rendered for the first track (which has a preview URL)
  const playButton = screen.getByTestId(`play-button-${mockTracks[0].id}`);
  expect(playButton).toBeInTheDocument();
  expect(playButton).toHaveAttribute("aria-label", "Play");
});

test("calls onSelectTrack when a track is clicked", async ({ expect }) => {
  const handleSelectTrack = vi.fn();

  render(
    <TrackSearchResults
      tracks={mockTracks}
      onSelectTrack={handleSelectTrack}
      isLoading={false}
    />
  );

  // Click on the first track
  fireEvent.click(screen.getByTestId(`track-result-${mockTracks[0].id}`));

  // Check if onSelectTrack was called with the correct track
  expect(handleSelectTrack).toHaveBeenCalledWith(mockTracks[0]);
});

test("plays audio when play button is clicked", async ({ expect }) => {
  render(
    <TrackSearchResults
      tracks={mockTracks}
      onSelectTrack={vi.fn()}
      isLoading={false}
    />
  );

  // Find and click the play button
  const playButton = screen.getByTestId(`play-button-${mockTracks[0].id}`);
  fireEvent.click(playButton);

  // Check if audio.play was called
  expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();

  // Check if the button changed to pause
  await waitFor(() => {
    expect(playButton).toHaveAttribute("aria-label", "Pause");
  });
});

test("pauses audio when pause button is clicked", async ({ expect }) => {
  render(
    <TrackSearchResults
      tracks={mockTracks}
      onSelectTrack={vi.fn()}
      isLoading={false}
    />
  );

  // Find and click the play button to start playing
  const playButton = screen.getByTestId(`play-button-${mockTracks[0].id}`);
  fireEvent.click(playButton);

  // Wait for the button to change to pause
  await waitFor(() => {
    expect(playButton).toHaveAttribute("aria-label", "Pause");
  });

  // Click again to pause
  fireEvent.click(playButton);

  // Check if audio.pause was called
  expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();

  // Check if the button changed back to play
  await waitFor(() => {
    expect(playButton).toHaveAttribute("aria-label", "Play");
  });
});

test("stops current audio when a different track is played", async ({
  expect,
}) => {
  // Create a second track with a preview URL for this test
  const tracksWithPreviews = [
    mockTracks[0],
    {
      ...mockTracks[1],
      preview_url: "https://example.com/preview2.mp3",
    },
  ];

  render(
    <TrackSearchResults
      tracks={tracksWithPreviews}
      onSelectTrack={vi.fn()}
      isLoading={false}
    />
  );

  // Find and click the play button for the first track
  const playButton1 = screen.getByTestId(
    `play-button-${tracksWithPreviews[0].id}`
  );
  fireEvent.click(playButton1);

  // Check if audio.play was called
  expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();

  // Wait for the button to change to pause
  await waitFor(() => {
    expect(playButton1).toHaveAttribute("aria-label", "Pause");
  });

  // Reset the mock to check if it's called again
  vi.mocked(window.HTMLMediaElement.prototype.pause).mockClear();
  vi.mocked(window.HTMLMediaElement.prototype.play).mockClear();

  // Find and click the play button for the second track
  const playButton2 = screen.getByTestId(
    `play-button-${tracksWithPreviews[1].id}`
  );
  fireEvent.click(playButton2);

  // Check if audio.pause was called to stop the first track
  expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();

  // Check if audio.play was called to play the second track
  expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();

  // Check if the first button changed back to play
  await waitFor(() => {
    expect(playButton1).toHaveAttribute("aria-label", "Play");
  });

  // Check if the second button changed to pause
  await waitFor(() => {
    expect(playButton2).toHaveAttribute("aria-label", "Pause");
  });
});

test("handles audio ended event", async ({ expect }) => {
  render(
    <TrackSearchResults
      tracks={mockTracks}
      onSelectTrack={vi.fn()}
      isLoading={false}
    />
  );

  // Find and click the play button
  const playButton = screen.getByTestId(`play-button-${mockTracks[0].id}`);
  fireEvent.click(playButton);

  // Wait for the button to change to pause
  await waitFor(() => {
    expect(playButton).toHaveAttribute("aria-label", "Pause");
  });

  // Simulate the audio ended event
  const audioElement = document.querySelector("audio");
  fireEvent.ended(audioElement!);

  // Check if the button changed back to play
  await waitFor(() => {
    expect(playButton).toHaveAttribute("aria-label", "Play");
  });
});

test("handles audio error event", async ({ expect }) => {
  render(
    <TrackSearchResults
      tracks={mockTracks}
      onSelectTrack={vi.fn()}
      isLoading={false}
    />
  );

  // Find and click the play button
  const playButton = screen.getByTestId(`play-button-${mockTracks[0].id}`);
  fireEvent.click(playButton);

  // Wait for the button to change to pause
  await waitFor(() => {
    expect(playButton).toHaveAttribute("aria-label", "Pause");
  });

  // Simulate the audio error event
  const audioElement = document.querySelector("audio");
  fireEvent.error(audioElement!);

  // Check if the button changed back to play
  await waitFor(() => {
    expect(playButton).toHaveAttribute("aria-label", "Play");
  });
});
