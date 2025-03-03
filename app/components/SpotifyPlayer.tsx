"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

interface SpotifyPlayerProps {
  trackUri: string;
  onPlaybackEnded?: () => void;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({
  trackUri,
  onPlaybackEnded,
}) => {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load the Spotify Web Playback SDK script
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    // Initialize the player when the SDK is ready
    window.onSpotifyWebPlaybackSDKReady = async () => {
      try {
        const player = new window.Spotify.Player({
          name: "De Worm Player",
          getOAuthToken: async (cb: (token: string) => void) => {
            // Get the access token from the cookie
            const response = await fetch("/api/auth/token");
            const { access_token } = await response.json();
            cb(access_token);
          },
          volume: 0.5,
        });

        // Error handling
        player.addListener(
          "initialization_error",
          ({ message }: { message: string }) => {
            setError(`Failed to initialize: ${message}`);
          }
        );

        player.addListener(
          "authentication_error",
          ({ message }: { message: string }) => {
            setError(`Failed to authenticate: ${message}`);
          }
        );

        player.addListener(
          "account_error",
          ({ message }: { message: string }) => {
            setError(`Failed to validate Spotify account: ${message}`);
          }
        );

        player.addListener(
          "playback_error",
          ({ message }: { message: string }) => {
            setError(`Failed to perform playback: ${message}`);
          }
        );

        // Playback status updates
        player.addListener("player_state_changed", (state: any) => {
          if (state) {
            setIsPlaying(!state.paused);
            if (state.track_window.current_track.uri !== trackUri) {
              setIsPlaying(false);
            }
          }
        });

        // Ready
        player.addListener("ready", ({ device_id }: { device_id: string }) => {
          console.log("Ready with Device ID", device_id);
          setPlayer(player);
        });

        // Not Ready
        player.addListener(
          "not_ready",
          ({ device_id }: { device_id: string }) => {
            console.log("Device ID has gone offline", device_id);
          }
        );

        // Connect to the player
        await player.connect();
      } catch (error) {
        setError(`Failed to initialize player: ${error}`);
      }
    };

    return () => {
      document.body.removeChild(script);
      if (player) {
        player.disconnect();
      }
    };
  }, [player]);

  useEffect(() => {
    if (player && trackUri) {
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
      if (isPlaying) {
        await player.pause();
      } else {
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
