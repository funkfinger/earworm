"use client";

import { useState } from "react";
import SpotifyWebPlayer from "../components/SpotifyWebPlayer";
import RandomSongSelector from "../components/RandomSongSelector";

export default function TestComponentsPage() {
  const [showPlayer, setShowPlayer] = useState(true);
  const [showRandomSongSelector, setShowRandomSongSelector] = useState(true);

  return (
    <div className="min-h-screen bg-[#2A1810] text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Component Test Page</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Test Controls</h2>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              showPlayer ? "bg-green-600" : "bg-gray-600"
            }`}
            onClick={() => setShowPlayer(!showPlayer)}
          >
            {showPlayer ? "Hide" : "Show"} Spotify Player
          </button>

          <button
            className={`px-4 py-2 rounded ${
              showRandomSongSelector ? "bg-green-600" : "bg-gray-600"
            }`}
            onClick={() => setShowRandomSongSelector(!showRandomSongSelector)}
          >
            {showRandomSongSelector ? "Hide" : "Show"} Random Song Selector
          </button>
        </div>
      </div>

      {showPlayer && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Spotify Web Player</h2>
          <SpotifyWebPlayer trackId="spotify:track:4cOdK2wGLETKBW3PvgPWqT" />
        </div>
      )}

      {showRandomSongSelector && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Random Song Selector</h2>
          <RandomSongSelector seedTrackId="4cOdK2wGLETKBW3PvgPWqT" />
        </div>
      )}
    </div>
  );
}
