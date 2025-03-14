"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SearchCombobox,
  SearchResult,
} from "@/app/components/ui/search-combobox";
import { searchSpotifyTracks, type SpotifyTrack } from "@/app/lib/spotify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

export default function SearchPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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

  const handleSelect = async (result: SearchResult) => {
    try {
      setError(null);

      // Store the selected song as the earworm
      const response = await fetch("/api/earworm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackId: result.id,
          trackName: result.title,
          artistName: result.artist,
          albumArt: result.albumArt,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // If unauthorized, redirect to login
          router.push("/login");
          return;
        }
        throw new Error("Failed to save earworm");
      }

      // Navigate to the playback screen
      router.push("/playback");
    } catch (error) {
      console.error("Failed to handle song selection:", error);
      setError("Failed to save your selection. Please try again.");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">Find Your Earworm</h1>
      <div className="mx-auto max-w-xl">
        <SearchCombobox
          onSearch={handleSearch}
          onSelect={handleSelect}
          placeholder="Search for songs..."
          className="w-full"
        />
        <Dialog open={!!error} onOpenChange={() => setError(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Error</DialogTitle>
            </DialogHeader>
            <p>{error}</p>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
