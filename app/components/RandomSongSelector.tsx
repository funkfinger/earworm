"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getAccessToken } from "../lib/spotify/api";
import RandomSongPlayer from "./RandomSongPlayer";
import React from "react";

// Define the Track interface based on what's used in RandomSongPlayer
interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
}

// Define the PlaylistItem interface
interface PlaylistItem {
  track: Track;
}

interface RandomSongSelectorProps {
  seedTrackId: string;
  title?: string;
  description?: string;
}

// Function to get recommendations based on a seed track
async function getRecommendations(seedTrackId: string): Promise<Track[]> {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTrackId}&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || "Failed to fetch recommendations"
      );
    }

    const data = await response.json();
    if (!data.tracks || data.tracks.length === 0) {
      throw new Error("No recommendations found");
    }

    return data.tracks;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    throw error;
  }
}

// Function to get tracks from a playlist
async function getPlaylistTracks(playlistId: string): Promise<Track[]> {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || "Failed to fetch playlist tracks"
      );
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      throw new Error("No tracks found in playlist");
    }

    return data.items.map((item: PlaylistItem) => item.track);
  } catch (error) {
    console.error("Error getting playlist tracks:", error);
    throw error;
  }
}

const RandomSongSelector = React.memo(
  ({ seedTrackId, title, description }: RandomSongSelectorProps) => {
    const [randomTrack, setRandomTrack] = useState<Track | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasInitialized, setHasInitialized] = useState(false);

    const getRandomTrackFromPlaylist = useCallback(async () => {
      try {
        setLoading(true);
        setError("");
        const playlistId = "0E9WYGYWZBqfmp6eJ0Nl1t"; // DeWorm playlist ID
        const tracks = await getPlaylistTracks(playlistId);

        if (tracks.length === 0) {
          throw new Error("No tracks found in the playlist");
        }

        // Filter tracks with preview URLs
        const tracksWithPreviews = tracks.filter((track) => track.preview_url);

        // If we have tracks with previews, use those, otherwise use all tracks
        const tracksToUse =
          tracksWithPreviews.length > 0 ? tracksWithPreviews : tracks;

        const randomIndex = Math.floor(Math.random() * tracksToUse.length);
        setRandomTrack(tracksToUse[randomIndex]);
        return tracksToUse[randomIndex];
      } catch (error) {
        console.error("Error getting random track from playlist:", error);
        setError("Failed to get a random track from the playlist");
        return null;
      } finally {
        setLoading(false);
      }
    }, []);

    const getRandomTrackFromRecommendations = useCallback(async () => {
      if (!seedTrackId) return null;

      try {
        setLoading(true);
        setError("");
        const recommendations = await getRecommendations(seedTrackId);

        if (recommendations.length === 0) {
          throw new Error("No recommendations found");
        }

        // Filter tracks with preview URLs
        const tracksWithPreviews = recommendations.filter(
          (track) => track.preview_url
        );

        // If we have tracks with previews, use those, otherwise use all tracks
        const tracksToUse =
          tracksWithPreviews.length > 0 ? tracksWithPreviews : recommendations;

        const randomIndex = Math.floor(Math.random() * tracksToUse.length);
        setRandomTrack(tracksToUse[randomIndex]);
        return tracksToUse[randomIndex];
      } catch (error) {
        console.error(
          "Error getting random track from recommendations:",
          error
        );
        return null;
      } finally {
        setLoading(false);
      }
    }, [seedTrackId]);

    const getRandomTrack = useCallback(async () => {
      let track = await getRandomTrackFromRecommendations();

      if (!track) {
        track = await getRandomTrackFromPlaylist();
      }

      if (!track) {
        setError("Could not find a replacement song. Please try again later.");
      }

      setHasInitialized(true);
      return track;
    }, [getRandomTrackFromRecommendations, getRandomTrackFromPlaylist]);

    useEffect(() => {
      if (seedTrackId && !hasInitialized) {
        getRandomTrack();
      }
    }, [seedTrackId, getRandomTrack, hasInitialized]);

    const handleRefresh = useCallback(async () => {
      await getRandomTrack();
    }, [getRandomTrack]);

    // Memoize the component content to prevent unnecessary re-renders
    const content = useMemo(() => {
      if (loading) {
        return (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
            <span className="ml-2 text-yellow-200">
              Finding a replacement song...
            </span>
          </div>
        );
      }

      if (error) {
        return (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">
            <p>{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 px-4 py-2 bg-red-700 hover:bg-red-800 rounded text-white"
            >
              Try Again
            </button>
          </div>
        );
      }

      if (randomTrack) {
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src={randomTrack.album.images[0]?.url}
                alt={randomTrack.album.name}
                className="w-16 h-16 rounded mr-4"
              />
              <div>
                <div className="font-medium text-white">{randomTrack.name}</div>
                <div className="text-yellow-100/60">
                  {randomTrack.artists.map((artist) => artist.name).join(", ")}
                </div>
              </div>
              <button
                onClick={handleRefresh}
                className="ml-auto p-2 text-yellow-300 hover:text-yellow-100"
                aria-label="Get another song"
                title="Get another song"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <RandomSongPlayer trackId={randomTrack.id} />
          </div>
        );
      }

      return null;
    }, [loading, error, randomTrack, handleRefresh]);

    return (
      <div className="bg-[#3C2218] p-6 rounded-lg border border-yellow-500/20">
        {title && (
          <h3 className="text-xl font-semibold text-yellow-400 mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-yellow-100/60 mb-4">{description}</p>
        )}
        {content}
      </div>
    );
  }
);

// Add display name for React.memo component
RandomSongSelector.displayName = "RandomSongSelector";

export default RandomSongSelector;
