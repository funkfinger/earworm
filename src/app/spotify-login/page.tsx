"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SpotifyLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSpotifyLogin = async () => {
    setIsLoading(true);

    try {
      // In a real app, we would redirect to Spotify OAuth
      // For now, we'll just simulate a login and redirect to the search page
      setTimeout(() => {
        router.push("/search");
      }, 1500);
    } catch (error) {
      console.error("Error logging in with Spotify:", error);
      setIsLoading(false);
    }
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
          Connect to Spotify
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
            To help cure your earworm, I&apos;ll need to play music through your
            Spotify account.
          </p>

          <button
            onClick={handleSpotifyLogin}
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-full text-center font-bold flex items-center justify-center"
            style={{ backgroundColor: "#1DB954", color: "white" }}
          >
            {isLoading ? (
              "Connecting..."
            ) : (
              <>
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Login with Spotify
              </>
            )}
          </button>

          <p className="mt-4 text-sm text-center" style={{ color: "#ddd2a7" }}>
            We&apos;ll only use your Spotify account to play music.
          </p>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm" style={{ color: "#ddd2a7" }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
