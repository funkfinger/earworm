"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Splash screen
  if (showSplash) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center p-8"
        style={{ backgroundColor: "#4e342e" }}
      >
        <div className="text-center">
          <h1
            className="text-5xl font-bold mb-4"
            style={{ color: "#ef798a", fontFamily: "Playpen Sans, cursive" }}
          >
            De Worm
          </h1>
          <div className="relative w-48 h-48 mx-auto my-8">
            {/* Replace with actual QT worm image */}
            <div className="w-full h-full rounded-full bg-pink-400 flex items-center justify-center">
              <span className="text-4xl">QT</span>
            </div>
          </div>
          <p className="text-xl" style={{ color: "#ddd2a7" }}>
            Your Earworm Cure
          </p>
        </div>
      </div>
    );
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center p-8"
      style={{ backgroundColor: "#4e342e" }}
    >
      <div className="w-full max-w-md">
        <h1
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: "#ef798a", fontFamily: "Playpen Sans, cursive" }}
        >
          De Worm
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
          <h2
            className="text-2xl font-semibold mb-4 text-center"
            style={{ color: "#ddd2a7", fontFamily: "Playpen Sans, cursive" }}
          >
            Got a song stuck in your head?
          </h2>
          <p className="mb-6 text-center" style={{ color: "#ddd2a7" }}>
            Hi! I&apos;m QT! I can help you get rid of that annoying earworm by
            playing another catchy song to replace it!
          </p>

          <div className="flex flex-col space-y-4">
            <Link
              href="/spotify-login"
              className="py-3 px-6 rounded-full text-center font-bold"
              style={{ backgroundColor: "#ef798a", color: "#4e342e" }}
            >
              Connect with Spotify
            </Link>
            <p className="text-sm text-center" style={{ color: "#ddd2a7" }}>
              We&apos;ll need to connect to your Spotify account to play music
            </p>
          </div>
        </div>

        <div className="rounded-lg p-6" style={{ backgroundColor: "#586f7c" }}>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "#ddd2a7", fontFamily: "Playpen Sans, cursive" }}
          >
            How it works:
          </h3>
          <ol
            className="list-decimal pl-5 space-y-2"
            style={{ color: "#ddd2a7" }}
          >
            <li>Connect your Spotify account</li>
            <li>Tell us what song is stuck in your head</li>
            <li>
              We&apos;ll play a replacement song that&apos;s equally catchy
            </li>
            <li>Your earworm will be replaced!</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
