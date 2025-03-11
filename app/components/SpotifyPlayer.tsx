"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/app/components/ui/button";

// Define base types for Spotify Web Playback SDK
type SpotifyCallback<T> = (data: T) => void;

interface SpotifyPlayerOptions {
  name: string;
  getOAuthToken: (cb: (token: string) => void) => void;
  volume: number;
}

// Event types
interface ErrorEvent {
  message: string;
}

interface ReadyEvent {
  device_id: string;
}

// Base type for the Spotify Player instance
interface SpotifyPlayerBase {
  connect(): Promise<boolean>;
  disconnect(): void;
  addListener<T>(event: string, callback: SpotifyCallback<T>): void;
  removeListener(event: string): void;
}

// Extended type with optional methods that might not be available immediately
interface SpotifyPlayer extends SpotifyPlayerBase {
  play?(options?: { context_uri?: string }): Promise<void>;
  pause?(): Promise<void>;
  resume?(): Promise<void>;
  getCurrentState?(): Promise<PlayerState | null>;
  setVolume?(volume: number): Promise<void>;
}

// SDK type
interface SpotifyWebPlaybackSDK {
  Player: {
    new (options: SpotifyPlayerOptions): SpotifyPlayerBase;
  };
}

interface PlayerState {
  paused: boolean;
  track_window: {
    current_track: {
      uri: string;
    };
  };
}

interface SpotifyPlayerProps {
  trackUri: string;
}

// Augment the Window interface
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

// Use a type assertion for the SDK
const getSpotifySDK = (): SpotifyWebPlaybackSDK | undefined => {
  type WindowWithSpotify = Window & {
    Spotify?: SpotifyWebPlaybackSDK;
  };
  return (window as WindowWithSpotify).Spotify;
};

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ trackUri }) => {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<SpotifyPlayer | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = async () => {
      try {
        const sdk = getSpotifySDK();
        if (!sdk) {
          throw new Error("Spotify SDK not loaded");
        }

        const spotifyPlayer = new sdk.Player({
          name: "De Worm Player",
          getOAuthToken: async (cb: (token: string) => void) => {
            const response = await fetch("/api/auth/token");
            const { access_token } = await response.json();
            cb(access_token);
          },
          volume: 0.5,
        }) as SpotifyPlayer;

        playerRef.current = spotifyPlayer;

        spotifyPlayer.addListener<ErrorEvent>(
          "initialization_error",
          ({ message }) => {
            setError(`Failed to initialize: ${message}`);
          }
        );

        spotifyPlayer.addListener<ErrorEvent>(
          "authentication_error",
          ({ message }) => {
            setError(`Failed to authenticate: ${message}`);
          }
        );

        spotifyPlayer.addListener<ErrorEvent>(
          "account_error",
          ({ message }) => {
            setError(`Failed to validate Spotify account: ${message}`);
          }
        );

        spotifyPlayer.addListener<ErrorEvent>(
          "playback_error",
          ({ message }) => {
            setError(`Failed to perform playback: ${message}`);
          }
        );

        spotifyPlayer.addListener<PlayerState>(
          "player_state_changed",
          (state) => {
            if (state) {
              setIsPlaying(!state.paused);
              if (state.track_window.current_track.uri !== trackUri) {
                setIsPlaying(false);
              }
            }
          }
        );

        spotifyPlayer.addListener<ReadyEvent>("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          setPlayer(spotifyPlayer);
        });

        spotifyPlayer.addListener<ReadyEvent>("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        await spotifyPlayer.connect();
      } catch (error) {
        setError(`Failed to initialize player: ${error}`);
      }
    };

    return () => {
      document.body.removeChild(script);
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, [trackUri]);

  useEffect(() => {
    if (player?.play && trackUri) {
      player
        .play({
          context_uri: trackUri,
        })
        .catch((error: Error) => {
          setError(`Failed to play track: ${error.message}`);
        });
    }
  }, [player, trackUri]);

  const handlePlayPause = async () => {
    if (!player) return;

    try {
      if (isPlaying && player.pause) {
        await player.pause();
      } else if (!isPlaying && player.resume) {
        await player.resume();
      }
    } catch (error) {
      setError(`Failed to ${isPlaying ? "pause" : "resume"}: ${error}`);
    }
  };

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-100">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={handlePlayPause}
        className="bg-secondary hover:bg-secondary-hover text-primary font-playpen"
      >
        {isPlaying ? "Pause" : "Play"}
      </Button>
    </div>
  );
};

export default SpotifyPlayer;
