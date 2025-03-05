"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock search results for demonstration
const mockSearchResults = [
  { id: "1", title: "Shape of You", artist: "Ed Sheeran" },
  { id: "2", title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee" },
  { id: "3", title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
  { id: "4", title: "Blinding Lights", artist: "The Weeknd" },
  { id: "5", title: "Dance Monkey", artist: "Tones and I" },
];

export default function Search() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof mockSearchResults>(
    []
  );
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Simulate API call to Spotify
    setTimeout(() => {
      setSearchResults(
        mockSearchResults.filter(
          (song) =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setShowResults(true);
      setIsSearching(false);
    }, 1000);
  };

  const handleSelectSong = (songId: string) => {
    // In a real app, we would save this to the database
    // For now, we'll just navigate to the playback page
    router.push(`/playback?songId=${songId}`);
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center p-8"
      style={{ backgroundColor: "#4e342e" }}
    >
      <div className="w-full max-w-md">
        <h1
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: "#ef798a", fontFamily: "Playpen Sans, cursive" }}
        >
          What&apos;s stuck in your head?
        </h1>

        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Replace with actual QT worm image */}
          <div className="w-full h-full rounded-full bg-pink-400 flex items-center justify-center">
            <span className="text-3xl">QT</span>
          </div>
        </div>

        <div
          className="rounded-lg p-6 mb-8"
          style={{ backgroundColor: "#727d71" }}
        >
          <p className="mb-6 text-center" style={{ color: "#ddd2a7" }}>
            Tell me what song is stuck in your head, and I&apos;ll help you
            replace it!
          </p>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a song or artist..."
                className="w-full py-3 px-4 rounded-full text-gray-800"
                style={{ backgroundColor: "#ddd2a7" }}
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="w-full py-3 px-6 rounded-full text-center font-bold"
                style={{
                  backgroundColor: "#ef798a",
                  color: "#4e342e",
                  opacity: isSearching || !searchQuery.trim() ? 0.7 : 1,
                }}
              >
                {isSearching ? "Searching..." : "Find My Earworm"}
              </button>
            </div>
          </form>

          {showResults && (
            <div className="mt-6">
              <h3
                className="text-xl font-semibold mb-4"
                style={{
                  color: "#ddd2a7",
                  fontFamily: "Playpen Sans, cursive",
                }}
              >
                Search Results:
              </h3>

              {searchResults.length === 0 ? (
                <p className="text-center" style={{ color: "#ddd2a7" }}>
                  No songs found. Try a different search term.
                </p>
              ) : (
                <ul className="space-y-3">
                  {searchResults.map((song) => (
                    <li
                      key={song.id}
                      className="p-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "#586f7c" }}
                      onClick={() => handleSelectSong(song.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p
                            className="font-semibold"
                            style={{ color: "#ddd2a7" }}
                          >
                            {song.title}
                          </p>
                          <p className="text-sm" style={{ color: "#ddd2a7" }}>
                            {song.artist}
                          </p>
                        </div>
                        <button
                          className="p-2 rounded-full"
                          style={{ backgroundColor: "#ef798a" }}
                          onClick={() => handleSelectSong(song.id)}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/spotify-login"
            className="text-sm"
            style={{ color: "#ddd2a7" }}
          >
            ← Back to Spotify login
          </Link>
        </div>
      </div>
    </div>
  );
}
