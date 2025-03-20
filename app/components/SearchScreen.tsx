"use client";

import { useState } from "react";
import { Mascot } from "./Mascot";
import { ThoughtBubble } from "./ThoughtBubble";
import { Button } from "./ui/Button";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";

interface Song {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
}

interface SearchScreenProps {
  onSongSelected: (song: Song) => void;
}

export function SearchScreen({ onSongSelected }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search function - in a real app, this would call the Spotify API
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Mock search results
    setTimeout(() => {
      const mockResults = [
        {
          id: "1",
          name: "Shape of You",
          artist: "Ed Sheeran",
          album: "÷ (Divide)",
          albumArt: "/images/placeholder.svg",
        },
        {
          id: "2",
          name: "Dance Monkey",
          artist: "Tones and I",
          album: "The Kids Are Coming",
          albumArt: "/images/placeholder.svg",
        },
        {
          id: "3",
          name: "Blinding Lights",
          artist: "The Weeknd",
          album: "After Hours",
          albumArt: "/images/placeholder.svg",
        },
      ];

      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-start gap-6 w-full">
      <Mascot size="sm" animation="wiggle" className="mb-2" />

      <ThoughtBubble>
        <h2 className="text-xl font-bold mb-2">
          What song is stuck in your head?
        </h2>
        <p>
          Search for the song that&apos;s been playing on repeat in your mind,
          and I&apos;ll help you replace it!
        </p>
      </ThoughtBubble>

      <div className="w-full max-w-md relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a song or artist..."
          className="hand-drawn-input w-full pr-12"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
          aria-label="Search"
        >
          <FaSearch />
        </Button>
      </div>

      {isSearching && (
        <div className="text-center py-4">
          <p>Searching...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="w-full max-w-md mt-4">
          <h3 className="text-lg font-semibold mb-3">Results:</h3>
          <ul className="space-y-3">
            {searchResults.map((song) => (
              <li key={song.id}>
                <button
                  onClick={() => onSongSelected(song)}
                  className="hand-drawn w-full flex items-center gap-3 p-3 hover:bg-[rgba(255,255,255,0.1)] transition-colors text-left"
                >
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={song.albumArt}
                      alt={`${song.album} cover`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{song.name}</p>
                    <p className="text-sm opacity-80">
                      {song.artist} • {song.album}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
