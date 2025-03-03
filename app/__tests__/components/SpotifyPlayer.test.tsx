import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import SpotifyPlayer from "@/app/components/SpotifyPlayer";

// Mock the Spotify Web Playback SDK
const mockPlayer = {
  addListener: jest.fn(),
  connect: jest.fn().mockResolvedValue(true),
  disconnect: jest.fn().mockResolvedValue(true),
  play: jest.fn().mockResolvedValue(true),
  pause: jest.fn().mockResolvedValue(true),
  resume: jest.fn().mockResolvedValue(true),
  getCurrentState: jest.fn().mockResolvedValue({
    paused: true,
    track_window: {
      current_track: {
        uri: "spotify:track:123",
      },
    },
  }),
};

// Mock the window.Spotify object
declare global {
  interface Window {
    Spotify: {
      Player: jest.Mock;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

// @ts-expect-error - We're mocking the Spotify object for testing
window.Spotify = {
  Player: jest.fn().mockImplementation(() => mockPlayer),
};

// Mock the fetch function
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({ access_token: "mock_token" }),
  })
);

describe("SpotifyPlayer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the player state
    mockPlayer.getCurrentState.mockResolvedValue({
      paused: true,
      track_window: {
        current_track: {
          uri: "spotify:track:123",
        },
      },
    });
  });

  it("renders the player with a play button", () => {
    render(<SpotifyPlayer trackUri="spotify:track:123" />);
    expect(screen.getByText("Play")).toBeInTheDocument();
  });

  it("loads the Spotify Web Playback SDK script", () => {
    render(<SpotifyPlayer trackUri="spotify:track:123" />);

    // Check if the script was added to the document
    const script = document.querySelector(
      'script[src="https://sdk.scdn.co/spotify-player.js"]'
    );
    expect(script).toBeInTheDocument();
  });

  it("initializes the Spotify player", async () => {
    render(<SpotifyPlayer trackUri="spotify:track:123" />);

    // Simulate the SDK ready event
    await act(async () => {
      window.onSpotifyWebPlaybackSDKReady();
    });

    // Wait for the player to be initialized
    await waitFor(() => {
      expect(window.Spotify.Player).toHaveBeenCalled();
    });

    // Verify the player was connected
    expect(mockPlayer.connect).toHaveBeenCalled();
  });

  it("plays the track when the play button is clicked", async () => {
    render(<SpotifyPlayer trackUri="spotify:track:123" />);

    // Simulate the SDK ready event
    await act(async () => {
      window.onSpotifyWebPlaybackSDKReady();
    });

    // Wait for the player to be ready
    await waitFor(() => {
      expect(mockPlayer.connect).toHaveBeenCalled();
    });

    // Simulate player ready state
    await act(async () => {
      const readyCallback = mockPlayer.addListener.mock.calls.find(
        (call) => call[0] === "ready"
      )[1];
      readyCallback({ device_id: "test-device" });
    });

    // Find and click the play button
    const playButton = screen.getByText("Play");
    await act(async () => {
      fireEvent.click(playButton);
    });

    // Wait for the play method to be called
    await waitFor(() => {
      expect(mockPlayer.play).toHaveBeenCalledWith({
        context_uri: "spotify:track:123",
      });
    });
  });

  it("pauses the track when the pause button is clicked", async () => {
    render(<SpotifyPlayer trackUri="spotify:track:123" />);

    // Simulate the SDK ready event
    await act(async () => {
      window.onSpotifyWebPlaybackSDKReady();
    });

    // Wait for the player to be ready
    await waitFor(() => {
      expect(mockPlayer.connect).toHaveBeenCalled();
    });

    // Simulate player ready state
    await act(async () => {
      const readyCallback = mockPlayer.addListener.mock.calls.find(
        (call) => call[0] === "ready"
      )[1];
      readyCallback({ device_id: "test-device" });
    });

    // Find and click the play button
    const playButton = screen.getByText("Play");
    await act(async () => {
      fireEvent.click(playButton);
    });

    // Simulate player state change to playing
    await act(async () => {
      const stateCallback = mockPlayer.addListener.mock.calls.find(
        (call) => call[0] === "player_state_changed"
      )[1];
      stateCallback({
        paused: false,
        track_window: {
          current_track: {
            uri: "spotify:track:123",
          },
        },
      });
    });

    // Find and click the pause button
    const pauseButton = screen.getByText("Pause");
    await act(async () => {
      fireEvent.click(pauseButton);
    });

    // Verify the pause method was called
    expect(mockPlayer.pause).toHaveBeenCalled();
  });

  it("displays an error message when initialization fails", async () => {
    // Mock the player to throw an error
    mockPlayer.connect.mockRejectedValue(new Error("Failed to connect"));

    render(<SpotifyPlayer trackUri="spotify:track:123" />);

    // Simulate the SDK ready event
    await act(async () => {
      window.onSpotifyWebPlaybackSDKReady();
    });

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to initialize/)).toBeInTheDocument();
    });
  });

  it("cleans up resources when unmounted", async () => {
    const { unmount } = render(<SpotifyPlayer trackUri="spotify:track:123" />);

    // Simulate the SDK ready event
    await act(async () => {
      window.onSpotifyWebPlaybackSDKReady();
    });

    // Wait for the player to be ready
    await waitFor(() => {
      expect(mockPlayer.connect).toHaveBeenCalled();
    });

    // Simulate player ready state
    await act(async () => {
      const readyCallback = mockPlayer.addListener.mock.calls.find(
        (call) => call[0] === "ready"
      )[1];
      readyCallback({ device_id: "test-device" });
    });

    // Unmount the component
    await act(async () => {
      unmount();
    });

    // Wait for the cleanup to be performed
    await waitFor(
      () => {
        expect(mockPlayer.disconnect).toHaveBeenCalled();
        expect(
          document.querySelector(
            'script[src="https://sdk.scdn.co/spotify-player.js"]'
          )
        ).toBeNull();
      },
      { timeout: 2000 }
    );

    // Verify the cleanup was performed
    expect(mockPlayer.disconnect).toHaveBeenCalled();
    expect(
      document.querySelector(
        'script[src="https://sdk.scdn.co/spotify-player.js"]'
      )
    ).toBeNull();
  });
});
