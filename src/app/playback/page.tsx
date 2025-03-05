"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Mock songs data for demonstration
const mockSongs = {
  "1": { id: "1", title: "Shape of You", artist: "Ed Sheeran" },
  "2": { id: "2", title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee" },
  "3": { id: "3", title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
  "4": { id: "4", title: "Blinding Lights", artist: "The Weeknd" },
  "5": { id: "5", title: "Dance Monkey", artist: "Tones and I" },
};

// Mock replacement songs
const replacementSongs = [
  {
    id: "101",
    title: "Baby Shark",
    artist: "Pinkfong",
    spotifyId: "3yfqSUWxFvZELEM4PmlwIR",
  },
  {
    id: "102",
    title: "Let It Go",
    artist: "Idina Menzel",
    spotifyId: "0qcr5FMsEO85NAQjrlDRKo",
  },
  {
    id: "103",
    title: "Happy",
    artist: "Pharrell Williams",
    spotifyId: "60nZcImufyMA1MKQY3dcCH",
  },
  {
    id: "104",
    title: "Call Me Maybe",
    artist: "Carly Rae Jepsen",
    spotifyId: "20I6sIOMTCkB6w7ryavxtO",
  },
  {
    id: "105",
    title: "Gangnam Style",
    artist: "PSY",
    spotifyId: "03UrZgTINDqvnUMbbIMhql",
  },
];

export default function Playback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const songId = searchParams.get("songId");

  const [earwormSong, setEarwormSong] = useState<
    (typeof mockSongs)[keyof typeof mockSongs] | null
  >(null);
  const [replacementSong, setReplacementSong] = useState<
    (typeof replacementSongs)[0] | null
  >(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackComplete, setPlaybackComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!songId) {
      router.push("/search");
      return;
    }

    // Get the earworm song
    const song = mockSongs[songId as keyof typeof mockSongs];
    if (!song) {
      router.push("/search");
      return;
    }

    setEarwormSong(song);

    // Select a random replacement song
    const randomIndex = Math.floor(Math.random() * replacementSongs.length);
    setReplacementSong(replacementSongs[randomIndex]);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, [songId, router]);

  const handlePlayMusic = () => {
    setIsPlaying(true);

    // Simulate playback completion after 5 seconds
    setTimeout(() => {
      setIsPlaying(false);
      setPlaybackComplete(true);

      // In a real app, we would save this to the database
      if (earwormSong && replacementSong) {
        saveEarwormData(earwormSong, replacementSong);
      }
    }, 5000);
  };

  const saveEarwormData = async (
    earworm: (typeof mockSongs)[keyof typeof mockSongs],
    replacement: (typeof replacementSongs)[0]
  ) => {
    try {
      // In a real app, we would save this to the database using Amplify
      console.log("Saving earworm data:", {
        stuckSongTitle: earworm.title,
        stuckSongArtist: earworm.artist,
        replacementSongTitle: replacement.title,
        replacementSongArtist: replacement.artist,
        replacementSongId: replacement.spotifyId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving earworm data:", error);
    }
  };

  const handleFeedback = (wasEffective: boolean) => {
    // In a real app, we would update the database with the feedback
    console.log("Feedback:", { wasEffective });

    // Navigate back to search
    router.push("/search");
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center p-8"
        style={{ backgroundColor: "#4e342e" }}
      >
        <div className="w-32 h-32 relative">
          <div className="w-full h-full rounded-full bg-pink-400 flex items-center justify-center animate-bounce">
            <span className="text-3xl">QT</span>
          </div>
        </div>
        <p className="mt-6 text-xl" style={{ color: "#ddd2a7" }}>
          Finding the perfect replacement song...
        </p>
      </div>
    );
  }

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
          {playbackComplete ? "Did it work?" : "Your Earworm Cure"}
        </h1>

        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Replace with actual QT worm image */}
          <div
            className={`w-full h-full rounded-full bg-pink-400 flex items-center justify-center ${
              isPlaying ? "animate-pulse" : ""
            }`}
          >
            <span className="text-3xl">QT</span>
          </div>
        </div>

        <div
          className="rounded-lg p-6 mb-8"
          style={{ backgroundColor: "#727d71" }}
        >
          {!playbackComplete ? (
            <>
              <div className="mb-6">
                <h2
                  className="text-xl font-semibold mb-2"
                  style={{
                    color: "#ddd2a7",
                    fontFamily: "Playpen Sans, cursive",
                  }}
                >
                  Your Earworm:
                </h2>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#586f7c" }}
                >
                  <p className="font-semibold" style={{ color: "#ddd2a7" }}>
                    {earwormSong?.title}
                  </p>
                  <p className="text-sm" style={{ color: "#ddd2a7" }}>
                    {earwormSong?.artist}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h2
                  className="text-xl font-semibold mb-2"
                  style={{
                    color: "#ddd2a7",
                    fontFamily: "Playpen Sans, cursive",
                  }}
                >
                  Your Replacement Song:
                </h2>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#586f7c" }}
                >
                  <p className="font-semibold" style={{ color: "#ddd2a7" }}>
                    {replacementSong?.title}
                  </p>
                  <p className="text-sm" style={{ color: "#ddd2a7" }}>
                    {replacementSong?.artist}
                  </p>
                </div>
              </div>

              <p className="mb-6 text-center" style={{ color: "#ddd2a7" }}>
                {isPlaying
                  ? "Playing your replacement song... Listen carefully!"
                  : "I've found a super catchy song to replace your earworm!"}
              </p>

              {!isPlaying && (
                <button
                  onClick={handlePlayMusic}
                  className="w-full py-3 px-6 rounded-full text-center font-bold"
                  style={{ backgroundColor: "#ef798a", color: "#4e342e" }}
                >
                  Play Replacement Song
                </button>
              )}

              {isPlaying && (
                <div className="flex justify-center">
                  <div className="w-16 h-16 relative">
                    <div className="w-full h-full rounded-full bg-pink-400 flex items-center justify-center animate-spin">
                      <span className="text-xl">♪</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="mb-6 text-center" style={{ color: "#ddd2a7" }}>
                Did &quot;{replacementSong?.title}&quot; successfully replace
                your earworm?
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleFeedback(true)}
                  className="flex-1 py-3 px-6 rounded-full text-center font-bold"
                  style={{ backgroundColor: "#8BC34A", color: "#4e342e" }}
                >
                  Yes, it worked!
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className="flex-1 py-3 px-6 rounded-full text-center font-bold"
                  style={{ backgroundColor: "#FF5722", color: "#4e342e" }}
                >
                  No, try again
                </button>
              </div>
            </>
          )}
        </div>

        {!playbackComplete && (
          <div className="text-center">
            <Link
              href="/search"
              className="text-sm"
              style={{ color: "#ddd2a7" }}
            >
              ← Back to search
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
