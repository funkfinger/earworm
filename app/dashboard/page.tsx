"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import UserProfile from "../components/UserProfile";
import ErrorBoundary from "../components/ErrorBoundary";
import RandomSongSelector from "../components/RandomSongSelector";
import DynamicSearch from "../components/DynamicSearch";
import { getAccessToken, addTrackToDeWormPlaylist } from "../lib/spotify/api";
import Image from "next/image";

interface User {
  display_name: string;
  images: { url: string }[];
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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [addingToPlaylist, setAddingToPlaylist] = useState(false);
  const [playlistSuccess, setPlaylistSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch user profile to check authentication
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/me");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        } else {
          // If not authenticated, redirect to home page
          router.push("/");
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load user profile"
        );
        // Redirect to home page on error
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        router.push("/");
      } else {
        throw new Error(data.error || "Failed to logout");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setError(error instanceof Error ? error.message : "Failed to logout");
    }
  };

  const handleSelectTrack = (track: Track) => {
    setSelectedTrack(track);
    // In a real app, we would save this to the database as the user's earworm
    console.log("Selected track:", track);
  };

  const handleAddToPlaylist = async () => {
    if (!selectedTrack) return;

    try {
      setAddingToPlaylist(true);
      setError("");
      setPlaylistSuccess(false);

      const token = await getAccessToken();
      const trackUri = selectedTrack.external_urls.spotify.replace(
        "https://open.spotify.com/track/",
        "spotify:track:"
      );

      await addTrackToDeWormPlaylist(trackUri, token);
      setPlaylistSuccess(true);

      // In a real app, this would navigate to the next step after a short delay
      setTimeout(() => {
        console.log("Continue to next step");
      }, 2000);
    } catch (err) {
      console.error("Failed to add track to playlist:", err);
      setError(
        err instanceof Error ? err.message : "Failed to add track to playlist"
      );
    } finally {
      setAddingToPlaylist(false);
    }
  };

  const handleSearchError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2A1810] text-white flex items-center justify-center">
        <div className="animate-pulse text-2xl">Loading your experience...</div>
      </div>
    );
  }

  // Dashboard content component to be wrapped with ErrorBoundary
  const DashboardContent = () => (
    <div className="min-h-screen bg-[#2A1810] text-white">
      <header className="bg-[#3C2218] shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-yellow-300 to-pink-500 text-transparent bg-clip-text">
            DeWorm
          </h1>
          {user && <UserProfile user={user} onLogout={handleLogout} />}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* QT Mascot and Welcome Message */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="w-48 h-48 relative">
              <Image
                src="/qt-mascot.svg"
                alt="QT Mascot"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-yellow-300 mb-4">
                Welcome, {user?.display_name}!
              </h2>
              <p className="text-xl text-yellow-100/80">
                I&apos;m QT, and I&apos;m here to help you get rid of that pesky
                earworm. Let&apos;s start by identifying the song that&apos;s
                stuck in your head.
              </p>
            </div>
          </div>

          {/* Earworm Input Section */}
          <div className="bg-[#3C2218] p-8 rounded-lg border border-pink-500/20">
            <h3 className="text-2xl font-semibold text-pink-400 mb-6">
              What song is stuck in your head?
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                {error}
              </div>
            )}

            {playlistSuccess && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-200">
                Song successfully added to the DeWorm playlist!
              </div>
            )}

            <div className="space-y-6">
              <DynamicSearch
                onSelectTrack={handleSelectTrack}
                onError={handleSearchError}
              />

              {/* Selected Track */}
              {selectedTrack && (
                <div className="mt-6 p-4 bg-[#2A1810] border border-pink-500/30 rounded-lg">
                  <h4 className="text-lg font-medium text-pink-300 mb-2">
                    Your selected earworm:
                  </h4>
                  <div className="flex items-center">
                    <img
                      src={selectedTrack.album.images[0]?.url}
                      alt={selectedTrack.album.name}
                      className="w-16 h-16 rounded mr-4"
                    />
                    <div>
                      <div className="font-medium text-white">
                        {selectedTrack.name}
                      </div>
                      <div className="text-yellow-100/60">
                        {selectedTrack.artists
                          .map((artist) => artist.name)
                          .join(", ")}
                      </div>
                    </div>
                    <div className="ml-auto flex flex-col sm:flex-row gap-2">
                      <button
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                        onClick={handleAddToPlaylist}
                        disabled={addingToPlaylist}
                      >
                        {addingToPlaylist ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Adding...
                          </span>
                        ) : (
                          "Add to Playlist"
                        )}
                      </button>
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        onClick={() => {
                          // In a real app, this would navigate to the next step
                          console.log("Continue to next step");
                        }}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-yellow-100/60">
                    <a
                      href="https://open.spotify.com/playlist/0E9WYGYWZBqfmp6eJ0Nl1t?si=ecb90e7de80b42d7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-yellow-300 underline"
                    >
                      View DeWorm Playlist
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps Preview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#3C2218] p-6 rounded-lg border border-pink-500/20 opacity-70">
              <h3 className="text-xl font-semibold text-pink-400 mb-2">
                Step 2: Mental Exercise
              </h3>
              <p className="text-yellow-100/60">
                After identifying your earworm, we&apos;ll guide you through a
                quick mental exercise.
              </p>
            </div>

            {/* Replace the placeholder with the actual RandomSongSelector component */}
            {selectedTrack ? (
              <RandomSongSelector
                seedTrackId={selectedTrack.id}
                title="Step 3: Replacement Song"
                description="Listen to this song to replace your earworm."
              />
            ) : (
              <div className="bg-[#3C2218] p-6 rounded-lg border border-yellow-500/20 opacity-70">
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                  Step 3: Replacement Song
                </h3>
                <p className="text-yellow-100/60">
                  First, select an earworm above to get a replacement song
                  recommendation.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="min-h-screen bg-[#2A1810] text-white flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full p-6 bg-red-900/50 border border-red-500 rounded-lg text-white">
            <h2 className="text-2xl font-semibold text-red-300 mb-4">
              Dashboard Error
            </h2>
            <p className="text-red-200 mb-6">
              {error.message || "An unexpected error occurred in the dashboard"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={reset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                data-testid="dashboard-error-reset-button"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      )}
      onError={(error) => {
        console.error("Dashboard ErrorBoundary caught an error:", error);
      }}
    >
      <DashboardContent />
    </ErrorBoundary>
  );
}
