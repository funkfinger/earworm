"use client";

import { useState, useEffect, useRef } from "react";
import { getAccessToken, getTrack } from "../lib/spotify/api";

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

interface RandomSongPlayerProps {
  trackId?: string;
  onPlaybackComplete?: () => void;
  autoPlay?: boolean;
}

export default function RandomSongPlayer({
  trackId,
  onPlaybackComplete,
  autoPlay = false,
}: RandomSongPlayerProps) {
  const [track, setTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch track details when trackId changes
  useEffect(() => {
    if (!trackId) return;

    const fetchTrack = async () => {
      try {
        setIsLoading(true);
        setError("");
        const token = await getAccessToken();
        const trackData = await getTrack(trackId, token);
        setTrack(trackData);

        if (autoPlay && trackData.preview_url) {
          // Small delay to ensure audio element is ready
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.play();
              setIsPlaying(true);
            }
          }, 100);
        }
      } catch (err) {
        console.error("Failed to fetch track:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch track");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrack();
  }, [trackId, autoPlay]);

  // Handle play/pause
  const togglePlayback = () => {
    if (!audioRef.current || !track?.preview_url) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Handle playback completion
  const handleEnded = () => {
    setIsPlaying(false);
    if (onPlaybackComplete) {
      onPlaybackComplete();
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-[#2A1810] rounded-lg border border-yellow-500/20 animate-pulse">
        <div className="h-4 bg-yellow-300/30 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-yellow-300/30 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[#2A1810] rounded-lg border border-red-500/30 text-red-300">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="p-4 bg-[#2A1810] rounded-lg border border-yellow-500/20 text-yellow-100/60">
        <p>No track selected</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#2A1810] rounded-lg border border-pink-500/30">
      <div className="flex items-center">
        <img
          src={track.album.images[0]?.url || "/placeholder-album.jpg"}
          alt={track.album.name}
          className="w-16 h-16 rounded mr-4"
        />
        <div className="flex-1">
          <h3 className="font-medium text-white">{track.name}</h3>
          <p className="text-yellow-100/60">
            {track.artists.map((artist) => artist.name).join(", ")}
          </p>
          {!track.preview_url && (
            <p className="text-red-300 text-sm mt-1">
              Preview not available for this track
            </p>
          )}
        </div>
      </div>

      {track.preview_url && (
        <>
          <audio
            ref={audioRef}
            src={track.preview_url}
            onEnded={handleEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          <div className="mt-4 flex items-center">
            <button
              onClick={togglePlayback}
              className="p-3 bg-pink-500 rounded-full hover:bg-pink-600 transition-colors mr-4"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
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
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>

            <div className="flex-1 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-yellow-100/60 mr-2"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-[#3C2218] rounded-lg appearance-none cursor-pointer"
                aria-label="Volume"
              />
            </div>
          </div>
        </>
      )}

      <div className="mt-4 text-center">
        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-yellow-300 hover:underline"
        >
          Listen on Spotify
        </a>
      </div>
    </div>
  );
}
