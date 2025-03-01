"use client";

import { useState, useRef } from "react";
import Image from "next/image";

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

interface TrackSearchResultsProps {
  tracks: Track[];
  onSelectTrack: (track: Track) => void;
  isLoading: boolean;
  isDropdown?: boolean;
}

export default function TrackSearchResults({
  tracks,
  onSelectTrack,
  isLoading,
  isDropdown = false,
}: TrackSearchResultsProps) {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle play/pause toggle
  const togglePlayback = (track: Track, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the track selection

    if (!track.preview_url) return;

    if (playingTrackId === track.id) {
      // If this track is already playing, pause it
      audioRef.current?.pause();
      setPlayingTrackId(null);
    } else {
      // If another track is playing, stop it first
      audioRef.current?.pause();

      // Set up the new audio
      if (audioRef.current) {
        audioRef.current.src = track.preview_url;
        audioRef.current.play();
        setPlayingTrackId(track.id);
      }
    }
  };

  // Handle audio ending
  const handleAudioEnded = () => {
    setPlayingTrackId(null);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center" data-testid="search-loading">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 bg-yellow-300/30 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-yellow-300/30 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div
        className="p-4 text-center text-yellow-100/60"
        data-testid="no-results-message"
      >
        No tracks found. Try a different search term.
      </div>
    );
  }

  const containerClasses = isDropdown
    ? "space-y-1 max-h-80 overflow-y-auto"
    : "space-y-2 max-h-80 overflow-y-auto pr-2";

  const itemClasses = isDropdown
    ? "flex items-center p-2 hover:bg-[#3C2218] cursor-pointer transition-all"
    : "flex items-center p-3 bg-[#2A1810] rounded-lg border border-yellow-500/20 hover:border-yellow-500/60 cursor-pointer transition-all";

  return (
    <div
      className={containerClasses}
      role="listbox"
      aria-label="Search results"
      data-testid="track-search-results"
    >
      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onError={() => setPlayingTrackId(null)}
      />

      {tracks.map((track) => (
        <div
          key={track.id}
          className={itemClasses}
          onClick={() => onSelectTrack(track)}
          role="option"
          aria-selected="false"
          data-testid={`track-result-${track.id}`}
        >
          <Image
            src={track.album.images[0]?.url || "/placeholder-album.svg"}
            alt={track.album.name}
            className="rounded mr-3"
            width={48}
            height={48}
            data-testid={`track-image-${track.id}`}
          />
          <div className="flex-1 min-w-0">
            <div
              className="text-white font-medium truncate"
              data-testid={`track-name-${track.id}`}
            >
              {track.name}
            </div>
            <div
              className="text-yellow-100/60 text-sm truncate"
              data-testid={`track-artist-${track.id}`}
            >
              {track.artists.map((artist) => artist.name).join(", ")}
            </div>
            {!track.preview_url && (
              <div className="text-red-300 text-xs mt-1">
                Preview not available
              </div>
            )}
          </div>
          {track.preview_url && (
            <button
              className="ml-2 p-2 bg-pink-500 rounded-full hover:bg-pink-600 transition-colors"
              onClick={(e) => togglePlayback(track, e)}
              aria-label={playingTrackId === track.id ? "Pause" : "Play"}
              data-testid={`play-button-${track.id}`}
            >
              {playingTrackId === track.id ? (
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
                  className="text-white"
                >
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
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
                  className="text-white"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
