"use client";

import { useState, useEffect, useCallback } from "react";
import { getAccessToken } from "../lib/spotify/api";
import Image from "next/image";

interface SpotifyWebPlayerProps {
  trackId?: string;
  onPlaybackComplete?: () => void;
}

// Define Spotify Player types
interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: <T>(eventName: string, callback: (data: T) => void) => void;
  removeListener: (eventName: string) => void;
  getCurrentState: () => Promise<SpotifyPlayerState | null>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position_ms: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
}

interface SpotifyPlayerState {
  context: {
    uri: string;
    metadata: Record<string, unknown>;
  };
  disallows: {
    pausing: boolean;
    peeking_next: boolean;
    peeking_prev: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  };
  duration: number;
  paused: boolean;
  position: number;
  repeat_mode: number;
  shuffle: boolean;
  track_window: {
    current_track: SpotifyTrack;
    previous_tracks: SpotifyTrack[];
    next_tracks: SpotifyTrack[];
  };
}

interface SpotifyTrack {
  id: string;
  uri: string;
  type: string;
  linked_from: {
    uri: string | null;
    id: string | null;
  };
  media_type: string;
  name: string;
  duration_ms: number;
  artists: Array<{
    name: string;
    uri: string;
    id: string;
  }>;
  album: {
    uri: string;
    name: string;
    id: string;
    images: Array<{
      url: string;
    }>;
  };
  is_playable: boolean;
}

interface ErrorEvent {
  message: string;
}

interface ReadyEvent {
  device_id: string;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (callback: (token: string) => void) => void;
        volume: number;
      }) => SpotifyPlayer;
    };
  }
}

export default function SpotifyWebPlayer({
  trackId,
  onPlaybackComplete,
}: SpotifyWebPlayerProps) {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Load the Spotify Web Playback SDK script
  useEffect(() => {
    // Add global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);

      // Check for specific error messages
      if (
        event.reason &&
        event.reason.message &&
        event.reason.message.includes("item_before_load")
      ) {
        setError(
          "Cannot perform operation; no list was loaded. Please try refreshing the page."
        );
        setIsLoading(false);
      }
    };

    // Add event listener for unhandled promise rejections
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    // Add error handling for script loading
    script.onerror = (error) => {
      console.error("Failed to load Spotify Web Playback SDK:", error);
      setError(
        "Failed to load Spotify Web Playback SDK. Please check your internet connection and try again."
      );
      setIsLoading(false);
    };

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      initializePlayer();
    };

    return () => {
      document.body.removeChild(script);
      if (player) {
        player.disconnect();
      }
      // Remove event listener when component unmounts
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, [player, initializePlayer]);

  // Initialize the Spotify Web Player
  const initializePlayer = useCallback(async () => {
    try {
      console.log("Initializing Spotify Web Player");

      const newPlayer = new window.Spotify.Player({
        name: "DeWorm Web Player",
        getOAuthToken: async (cb: (token: string) => void) => {
          // Get a fresh token each time to ensure it's valid
          try {
            const freshToken = await getAccessToken();
            cb(freshToken);
          } catch (err) {
            console.error("Failed to refresh token:", err);
            setError("Failed to refresh authentication token");
          }
        },
        volume: 0.5,
      });

      // Error handling
      newPlayer.addListener(
        "initialization_error",
        ({ message }: ErrorEvent) => {
          console.error("Initialization error:", message);
          setError(`Player initialization failed: ${message}`);
          setIsLoading(false);
        }
      );

      newPlayer.addListener(
        "authentication_error",
        ({ message }: ErrorEvent) => {
          console.error("Authentication error:", message);
          // Check if this is a scope-related error
          if (
            message.includes("scope") ||
            message.includes("Token does not satisfy scope") ||
            message.includes("Invalid token scopes")
          ) {
            setError(
              "Authentication failed: Your Spotify account doesn't have the required permissions. Please log out and log in again to grant the necessary permissions."
            );
          } else {
            setError(`Authentication failed: ${message}`);
          }
          setIsLoading(false);
        }
      );

      newPlayer.addListener("account_error", ({ message }: ErrorEvent) => {
        console.error("Account error:", message);
        if (message.includes("premium") || message.includes("Premium")) {
          setError(
            "Spotify Premium Required: The Web Playback SDK requires a Spotify Premium account. Please upgrade your account to use this feature."
          );
        } else {
          setError(`Account error: ${message}`);
        }
        setIsLoading(false);
      });

      newPlayer.addListener("playback_error", ({ message }: ErrorEvent) => {
        console.error("Playback error:", message);
        setError(`Playback error: ${message}`);
      });

      // Playback status updates
      newPlayer.addListener(
        "player_state_changed",
        (state: SpotifyPlayerState | null) => {
          if (!state) return;

          const {
            paused,
            track_window: { current_track },
          } = state;

          setCurrentTrack(current_track);
          setIsPaused(paused);

          if (state.paused && state.position === 0 && state.duration === 0) {
            if (onPlaybackComplete) {
              onPlaybackComplete();
            }
          }
        }
      );

      // Ready
      newPlayer.addListener("ready", ({ device_id }: ReadyEvent) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setIsActive(true);
        setIsLoading(false);
        setPlayer(newPlayer);
      });

      // Not Ready
      newPlayer.addListener("not_ready", ({ device_id }: ReadyEvent) => {
        console.log("Device ID has gone offline", device_id);
        setIsActive(false);
        setIsLoading(false);
      });

      // Connect to the player
      newPlayer.connect();
      setPlayer(newPlayer);
    } catch (err) {
      console.error("Failed to initialize player:", err);
      setError(
        err instanceof Error ? err.message : "Failed to initialize player"
      );
      setIsLoading(false);
    }
  }, [onPlaybackComplete]);

  // Play the specified track when trackId and deviceId are available
  useEffect(() => {
    const playTrack = async () => {
      if (!trackId || !deviceId || !isActive) return;

      try {
        console.log("Attempting to play track with Web Playback SDK:", trackId);

        // Extract the ID from Spotify URI if needed
        let formattedTrackId = trackId;
        if (formattedTrackId.includes("spotify:track:")) {
          formattedTrackId = formattedTrackId.split("spotify:track:")[1];
        } else if (
          formattedTrackId.includes("https://open.spotify.com/track/")
        ) {
          formattedTrackId = formattedTrackId
            .split("https://open.spotify.com/track/")[1]
            .split("?")[0];
        }

        console.log("Formatted track ID:", formattedTrackId);
        const token = await getAccessToken();

        // First, try to transfer playback to our device
        console.log(`Transferring playback to device ${deviceId}`);
        const transferResponse = await fetch(
          "https://api.spotify.com/v1/me/player",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              device_ids: [deviceId],
              play: false, // Don't start playing immediately
            }),
          }
        );

        if (!transferResponse.ok && transferResponse.status !== 204) {
          console.warn(
            `Transfer playback response: ${transferResponse.status}`
          );
          // Continue anyway, as this might still work
        } else {
          console.log("Successfully transferred playback to device");
        }

        // Wait a moment for the transfer to take effect
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Now start playback with the track
        console.log(
          `Starting playback of track: spotify:track:${formattedTrackId}`
        );
        const response = await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              uris: [`spotify:track:${formattedTrackId}`],
              position_ms: 0,
            }),
          }
        );

        if (!response.ok) {
          let errorMessage = `HTTP error ${response.status}`;
          try {
            const errorData = await response.json();
            console.error("Playback API error:", errorData);
            errorMessage = errorData.error?.message || errorMessage;

            // Special handling for common errors
            if (errorMessage.includes("NO_ACTIVE_DEVICE")) {
              throw new Error(
                "No active device found. Please try refreshing the page."
              );
            } else if (errorMessage.includes("PREMIUM_REQUIRED")) {
              throw new Error(
                "This functionality is restricted to premium users only."
              );
            }

            throw new Error(errorMessage);
          } catch (jsonError) {
            if (
              jsonError instanceof Error &&
              jsonError.message !== errorMessage
            ) {
              throw jsonError;
            }
            throw new Error(errorMessage);
          }
        }

        console.log("Successfully started playback");
      } catch (err) {
        console.error("Failed to play track:", err);
        setError(err instanceof Error ? err.message : "Failed to play track");
      }
    };

    playTrack();
  }, [trackId, deviceId, isActive]);

  // Toggle play/pause
  const togglePlay = async () => {
    if (!player) return;

    if (isPaused) {
      player.resume();
    } else {
      player.pause();
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-[#2A1810] rounded-lg border border-yellow-500/20 animate-pulse">
        <div className="h-4 bg-yellow-300/30 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-yellow-300/30 rounded w-1/2"></div>
        <p className="mt-4 text-xs text-yellow-100/60">
          Loading Spotify player... This requires a Premium account.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 rounded-lg border border-red-500/50 text-red-200">
        <p className="mb-2">{error}</p>

        {error.includes("Premium") ? (
          <div className="flex flex-col space-y-2">
            <p className="text-xs mb-4">
              The Spotify Web Playback SDK requires a Spotify Premium account.
              Free accounts cannot use this feature.
            </p>
            <a
              href={`https://open.spotify.com/track/${trackId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-white text-center"
            >
              Listen on Spotify
            </a>
            <a
              href="https://www.spotify.com/premium/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] rounded text-white text-center mt-2"
            >
              Upgrade to Spotify Premium
            </a>
          </div>
        ) : error.includes("Authentication failed") ||
          error.includes("Token") ? (
          <div className="flex flex-col space-y-2">
            <p className="text-xs mb-4">
              Your Spotify account doesn&apos;t have the required permissions.
              Please log out and log in again.
            </p>
            <a
              href="/api/auth/logout"
              className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded text-white text-center"
            >
              Log Out and Try Again
            </a>
            <p className="text-xs text-red-300">
              After logging out, log back in and make sure to accept all
              permission requests.
            </p>
          </div>
        ) : error.includes("no list was loaded") ||
          error.includes("No active device") ? (
          <div className="flex flex-col space-y-2">
            <p className="text-xs mb-4">
              There was an issue connecting to the Spotify player. This can
              happen if:
              <ul className="list-disc pl-5 mt-2">
                <li>
                  Your Spotify Premium account is being used on another device
                </li>
                <li>
                  The browser doesn&apos;t have permission to use the Spotify
                  Web Playback SDK
                </li>
                <li>There was a temporary connection issue with Spotify</li>
              </ul>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-700 hover:bg-yellow-800 rounded text-white text-center"
            >
              Refresh Page
            </button>
            <a
              href={`https://open.spotify.com/track/${trackId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-white text-center mt-2"
            >
              Listen on Spotify Instead
            </a>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <a
              href={`https://open.spotify.com/track/${trackId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded text-white inline-block"
            >
              Listen on Spotify
            </a>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-700 hover:bg-yellow-800 rounded text-white text-center mt-2"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="p-4 bg-[#2A1810] rounded-lg border border-yellow-500/20 text-yellow-100/60">
        <p>Connecting to Spotify...</p>
        <p className="mt-2 text-xs">
          This feature requires a Spotify Premium account. If loading takes too
          long, you may not have a Premium subscription.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-[#3C2218] p-6 rounded-lg border border-green-500/20"
      data-testid="spotify-player"
    >
      <div className="flex items-center">
        <Image
          src={currentTrack.album.images[0]?.url || "/placeholder-album.svg"}
          alt={currentTrack.album.name}
          className="rounded mr-4"
          width={64}
          height={64}
          data-testid="track-album-image"
        />
        <div className="flex-1">
          <h3 className="font-medium text-white" data-testid="track-name">
            {currentTrack.name}
          </h3>
          <p className="text-yellow-100/60" data-testid="track-artist">
            {currentTrack.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <button
          onClick={togglePlay}
          className="p-3 bg-pink-500 rounded-full hover:bg-pink-600 transition-colors"
          aria-label={isPaused ? "Play" : "Pause"}
          data-testid="playback-button"
        >
          {isPaused ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          )}
        </button>
      </div>

      <div className="mt-4 text-center text-xs text-yellow-100/40">
        <p>Full playback powered by Spotify Premium</p>
      </div>
    </div>
  );
}
