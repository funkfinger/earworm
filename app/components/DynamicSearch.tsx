"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import TrackSearchResults from "./TrackSearchResults";
import { searchTracks, getAccessToken } from "../lib/spotify/api";

// Custom debounce function specifically for string input
function debounceStringInput(
  func: (input: string) => void,
  wait: number
): (input: string) => void {
  // In test environment, execute immediately without debouncing
  // @ts-expect-error - Accessing test helper property
  if (typeof window !== "undefined" && window.__TEST_IMMEDIATE_DEBOUNCE) {
    return func;
  }

  let timeout: NodeJS.Timeout | null = null;

  return function (input: string) {
    const later = () => {
      timeout = null;
      func(input);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

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

interface DynamicSearchProps {
  onSelectTrack: (track: Track) => void;
  onError?: (error: string) => void;
}

const DynamicSearch = ({ onSelectTrack, onError }: DynamicSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Function to perform the search
  const performSearch = useCallback(
    async (query: string) => {
      if (!query || query.length < 3) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        setIsSearching(true);
        setError("");

        const token = await getAccessToken();
        const results = await searchTracks(query, token);

        setSearchResults(results);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search failed:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to search tracks";
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [onError]
  );

  // Create a debounced version of the search function
  const debouncedSearch = useCallback(
    debounceStringInput(function (query: string) {
      performSearch(query);
    }, 300),
    [performSearch]
  );

  // Handle input change with debounced search
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      if (query.length >= 3) {
        debouncedSearch(query);
      } else {
        setShowDropdown(false);
      }
    },
    [debouncedSearch]
  );

  // Manual search button handler
  const handleSearch = useCallback(() => {
    if (searchQuery.trim().length >= 3) {
      performSearch(searchQuery);
    }
  }, [searchQuery, performSearch]);

  const handleSelectTrack = useCallback(
    (track: Track) => {
      onSelectTrack(track);
      setShowDropdown(false);
      setSearchQuery(""); // Clear the search after selection
    },
    [onSelectTrack]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Focus the input when the component mounts
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <div>
      <label htmlFor="song-search" className="block text-yellow-100 mb-2">
        Search for a song:
      </label>
      <div className="flex gap-2 relative">
        <input
          id="song-search"
          type="text"
          placeholder="Type song title or artist..."
          className="flex-1 px-4 py-3 bg-[#2A1810] border border-yellow-500/20 rounded-lg text-white focus:outline-none focus:border-yellow-500/60"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onClick={(e) => {
            e.stopPropagation();
            if (searchResults.length > 0 && searchQuery.length >= 3) {
              setShowDropdown(true);
            }
          }}
          ref={searchInputRef}
          aria-label="Search for songs"
          aria-autocomplete="list"
          aria-controls="search-results-dropdown"
          aria-expanded={showDropdown}
          data-testid="song-search-input"
        />
        <button
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-lg font-medium hover:opacity-90 transition-opacity"
          onClick={handleSearch}
          disabled={isSearching || searchQuery.length < 3}
          data-testid="search-button"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>

        {/* Dynamic Search Results Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div
            id="search-results-dropdown"
            className="absolute top-full left-0 right-0 mt-1 bg-[#2A1810] border border-yellow-500/30 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            data-testid="search-results-dropdown"
          >
            <TrackSearchResults
              tracks={searchResults}
              onSelectTrack={handleSelectTrack}
              isLoading={isSearching}
              isDropdown={true}
            />
          </div>
        )}
      </div>
      {searchQuery.length > 0 && searchQuery.length < 3 && (
        <p
          className="mt-1 text-xs text-yellow-300"
          data-testid="search-helper-text"
        >
          Type at least 3 characters to search
        </p>
      )}
      {error && (
        <p
          className="mt-1 text-xs text-red-400"
          data-testid="search-error-text"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default DynamicSearch;
