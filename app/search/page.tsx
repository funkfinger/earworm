"use client";

import React from "react";
import { SearchCombobox, SearchResult } from "@/components/ui/search-combobox";
import { searchSpotifyTracks, type SpotifyTrack } from "@/lib/spotify";

export default function SearchPage() {
  const handleSearch = async (query: string) => {
    try {
      const results = await searchSpotifyTracks(query);
      return results.map((track: SpotifyTrack) => ({
        id: track.id,
        title: track.name,
        artist: track.artists[0].name,
        albumArt: track.album.images[0]?.url || "",
      }));
    } catch (error) {
      console.error("Failed to search tracks:", error);
      return [];
    }
  };

  const handleSelect = (result: SearchResult) => {
    // TODO: Handle track selection
    console.log("Selected track:", result);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Find Your Next Earworm
      </h1>
      <div className="mx-auto max-w-xl">
        <SearchCombobox
          onSearch={handleSearch}
          onSelect={handleSelect}
          placeholder="Search for songs..."
          className="w-full"
        />
      </div>
    </main>
  );
}
