"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Define types
type Song = {
  id: string;
  title: string;
  artist: string;
};

type ReplacementSong = {
  id: string;
  title: string;
  artist: string;
  spotifyId: string;
};

// Mock songs data for demonstration
const mockSongs: Record<string, Song> = {
  "1": { id: "1", title: "Shape of You", artist: "Ed Sheeran" },
  "2": { id: "2", title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee" },
  "3": { id: "3", title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
  "4": { id: "4", title: "Blinding Lights", artist: "The Weeknd" },
  "5": { id: "5", title: "Dance Monkey", artist: "Tones and I" },
};

// Mock replacement songs
const replacementSongs: ReplacementSong[] = [
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

  const [earwormSong, setEarwormSong] = useState<Song | null>(null);
  const [replacementSong, setReplacementSong] =
    useState<ReplacementSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackComplete, setPlaybackComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!songId) {
      router.push("/search");
      return;
    }

    // Get the earworm song
    const song = mockSongs[songId];
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
    }, 5000);
  };

  const handleFeedback = (wasEffective: boolean) => {
    // In a real app, we would update the database with the feedback
    console.log("Feedback:", { wasEffective });

    // Navigate back to search
    router.push("/search");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-primary text-primary-foreground">
        <div className="w-32 h-32 relative">
          <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center animate-bounce">
            <span className="text-3xl">QT</span>
          </div>
        </div>
        <p className="mt-6 text-xl text-accent-a">
          Finding the perfect replacement song...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-primary text-primary-foreground">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center text-secondary font-playpen">
          {playbackComplete ? "Did it work?" : "Your Earworm Cure"}
        </h1>

        <div className="relative w-32 h-32 mx-auto mb-8">
          <Image
            src="/images/worm.svg"
            alt="QT Mascot"
            fill
            className="object-contain"
            priority={true}
          />
        </div>

        <div className="rounded-lg p-6 mb-8 bg-accent-a">
          {!playbackComplete ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-primary-foreground font-playpen">
                  Your Earworm:
                </h2>
                <div className="p-3 rounded-lg bg-accent-b">
                  <p className="font-semibold text-primary-foreground">
                    {earwormSong?.title}
                  </p>
                  <p className="text-sm text-primary-foreground">
                    {earwormSong?.artist}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-primary-foreground font-playpen">
                  Your Replacement Song:
                </h2>
                <div className="p-3 rounded-lg bg-accent-b">
                  <p className="font-semibold text-primary-foreground">
                    {replacementSong?.title}
                  </p>
                  <p className="text-sm text-primary-foreground">
                    {replacementSong?.artist}
                  </p>
                </div>
              </div>

              <p className="mb-6 text-center text-primary-foreground">
                {isPlaying
                  ? "Playing your replacement song... Listen carefully!"
                  : "I've found a super catchy song to replace your earworm!"}
              </p>

              {!isPlaying && (
                <button
                  onClick={handlePlayMusic}
                  className="w-full py-3 px-6 rounded-full text-center font-bold bg-secondary text-primary"
                >
                  Play Replacement Song
                </button>
              )}

              {isPlaying && (
                <div className="flex justify-center">
                  <div className="w-16 h-16 relative">
                    <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center animate-spin">
                      <span className="text-xl">♪</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="mb-6 text-center text-primary-foreground">
                Did the replacement song help cure your earworm?
              </p>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => handleFeedback(true)}
                  className="py-3 px-6 rounded-full text-center font-bold bg-green-500 text-white"
                >
                  Yes, it worked!
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className="py-3 px-6 rounded-full text-center font-bold bg-red-500 text-white"
                >
                  No, try again
                </button>
              </div>
            </>
          )}
        </div>

        <div className="text-center">
          <Link href="/search" className="text-sm text-accent-a">
            ← Back to search
          </Link>
        </div>
      </div>
    </div>
  );
}
