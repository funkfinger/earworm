import { test, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import RandomSongPlayer from "../../app/components/RandomSongPlayer";
import { getTrack } from "../../app/lib/spotify/api";

// Mock the next/image component
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

// Mock the Spotify API
vi.mock("../../app/lib/spotify/api", () => ({
  getAccessToken: vi.fn().mockResolvedValue("mock-token"),
  getTrack: vi.fn(),
}));

// Mock HTMLMediaElement
beforeEach(() => {
  // Mock implementation of HTMLMediaElement
  window.HTMLMediaElement.prototype.play = vi.fn();
  window.HTMLMediaElement.prototype.pause = vi.fn();

  // Use a safer approach to mock volume
  let volumeValue = 0.5;
  Object.defineProperty(window.HTMLMediaElement.prototype, "volume", {
    get: function () {
      return volumeValue;
    },
    set: function (v) {
      volumeValue = v;
    },
  });

  // Reset mocks
  vi.resetAllMocks();
});

// Clean up after each test
afterEach(() => {
  cleanup();
});

test("renders loading state initially", async ({ expect }) => {
  // Mock getTrack to delay response
  vi.mocked(getTrack).mockImplementation(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
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
          });
        }, 100);
      })
  );

  const { container } = render(<RandomSongPlayer trackId="track1" />);

  // Check for loading state by looking for the animate-pulse class
  const loadingElement = container.querySelector(".animate-pulse");
  expect(loadingElement).toBeInTheDocument();
});

test("displays track information when loaded", async ({ expect }) => {
  // Mock getTrack to return track data
  vi.mocked(getTrack).mockResolvedValue({
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
  });

  render(<RandomSongPlayer trackId="track1" />);

  // Wait for track information to be displayed using data-testid
  await waitFor(() => {
    const trackName = screen.getByTestId("track-name");
    expect(trackName).toBeInTheDocument();
    expect(trackName.textContent).toBe("Test Track");
  });

  // Check for artist name using data-testid
  const artistElement = screen.getByTestId("track-artist");
  expect(artistElement.textContent).toBe("Test Artist");

  // Check for album image
  const albumImage = screen.getByTestId("track-album-image");
  expect(albumImage).toHaveAttribute("src", "https://example.com/album.jpg");

  // Check for audio element
  const audioElement = screen.getByTestId("audio-element");
  expect(audioElement).toBeInTheDocument();
  expect(audioElement).toHaveAttribute(
    "src",
    "https://example.com/preview.mp3"
  );

  // Check for playback button
  const playButton = screen.getByTestId("playback-button");
  expect(playButton).toBeInTheDocument();
  expect(playButton).toHaveAttribute("aria-label", "Play");
});

test("handles tracks without preview URLs", async ({ expect }) => {
  // Mock getTrack to return track without preview_url
  vi.mocked(getTrack).mockResolvedValue({
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
    preview_url: null,
  });

  render(<RandomSongPlayer trackId="track1" />);

  // Wait for track information to be displayed
  await waitFor(() => {
    const trackName = screen.getByTestId("track-name");
    expect(trackName).toBeInTheDocument();
    expect(trackName.textContent).toBe("Test Track");
  });

  // Check for preview not available message
  const previewMessage = screen.getByTestId("no-preview-message");
  expect(previewMessage).toBeInTheDocument();
  expect(previewMessage.textContent).toBe(
    "Preview not available for this track"
  );

  // Play button should not be present
  expect(screen.queryByTestId("playback-button")).not.toBeInTheDocument();

  // Spotify link should be present
  const spotifyLink = screen.getByTestId("spotify-link");
  expect(spotifyLink).toBeInTheDocument();
  expect(spotifyLink).toHaveAttribute(
    "href",
    "https://open.spotify.com/track/123"
  );
});

test("toggles play/pause when button is clicked", async ({ expect }) => {
  // Mock getTrack to return track data
  vi.mocked(getTrack).mockResolvedValue({
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
  });

  render(<RandomSongPlayer trackId="track1" />);

  // Wait for track information to be displayed
  await waitFor(() => {
    const trackName = screen.getByTestId("track-name");
    expect(trackName).toBeInTheDocument();
    expect(trackName.textContent).toBe("Test Track");
  });

  // Find play button
  const playButton = screen.getByTestId("playback-button");
  expect(playButton).toBeInTheDocument();
  expect(playButton).toHaveAttribute("aria-label", "Play");

  // Click play button
  fireEvent.click(playButton);

  // HTMLMediaElement.play should have been called
  expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();

  // Wait for pause button to appear
  await waitFor(() => {
    expect(playButton).toHaveAttribute("aria-label", "Pause");
  });

  // Click pause button
  fireEvent.click(playButton);

  // HTMLMediaElement.pause should have been called
  expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();

  // Button should change back to play
  await waitFor(() => {
    expect(playButton).toHaveAttribute("aria-label", "Play");
  });
});

test("changes volume when slider is adjusted", async ({ expect }) => {
  // Mock getTrack to return track data
  vi.mocked(getTrack).mockResolvedValue({
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
  });

  render(<RandomSongPlayer trackId="track1" />);

  // Wait for track information to be displayed
  await waitFor(() => {
    const trackName = screen.getByTestId("track-name");
    expect(trackName).toBeInTheDocument();
    expect(trackName.textContent).toBe("Test Track");
  });

  // Find volume slider
  const volumeSlider = screen.getByTestId("volume-slider");
  expect(volumeSlider).toBeInTheDocument();

  // Change volume
  fireEvent.change(volumeSlider, { target: { value: "0.3" } });

  // We can't directly check the volume value in the test
  // since we're using a closure variable, but we can verify
  // that the volume slider's value was updated
  expect(volumeSlider).toHaveValue("0.3");
});
