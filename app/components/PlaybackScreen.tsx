"use client";

import { useState, useEffect } from "react";
import { Mascot } from "./Mascot";
import { ThoughtBubble } from "./ThoughtBubble";
import { Button } from "./ui/Button";
import Image from "next/image";
import { FaPlay, FaPause } from "react-icons/fa";

interface Song {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
}

interface PlaybackScreenProps {
  earwormSong: Song;
  onPlaybackComplete: () => void;
}

export function PlaybackScreen({
  earwormSong,
  onPlaybackComplete,
}: PlaybackScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replacementSong, setReplacementSong] = useState<Song | null>(null);
  const [stage, setStage] = useState<"intro" | "loading" | "playing">("intro");

  // Mock function to get a replacement song
  useEffect(() => {
    if (stage === "loading") {
      // Simulate API call to get a replacement song
      const timer = setTimeout(() => {
        setReplacementSong({
          id: "replacement-1",
          name: "Uptown Funk",
          artist: "Mark Ronson ft. Bruno Mars",
          album: "Uptown Special",
          albumArt: "/images/placeholder.svg",
        });
        setStage("playing");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Mock playback progress
  useEffect(() => {
    if (isPlaying && stage === "playing") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            setIsPlaying(false);
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 300); // Faster for demo purposes

      return () => clearInterval(interval);
    }
  }, [isPlaying, stage]);

  const handlePlayPause = () => {
    if (stage === "intro") {
      setStage("loading");
    } else if (stage === "playing") {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md mx-auto">
      <Mascot size="sm" animation={stage === "loading" ? "wiggle" : "none"} />

      {stage === "intro" && (
        <ThoughtBubble>
          <h2 className="text-xl font-bold mb-2">Great choice!</h2>
          <p className="mb-4">
            I&apos;ve found the perfect replacement song to help cure your
            earworm.
          </p>
          <p>
            Click the button below and I&apos;ll play a catchy tune that should
            replace &quot;{earwormSong.name}&quot; in your head!
          </p>
        </ThoughtBubble>
      )}

      {stage === "loading" && (
        <ThoughtBubble>
          <h2 className="text-xl font-bold mb-2">
            Finding the perfect cure...
          </h2>
          <p>
            I&apos;m searching for a song that&apos;s even catchier than &quot;
            {earwormSong.name}&quot;!
          </p>
        </ThoughtBubble>
      )}

      {stage === "playing" && replacementSong && (
        <>
          <ThoughtBubble>
            <h2 className="text-xl font-bold mb-2">Here&apos;s your cure!</h2>
            <p>
              Listen to this song completely to replace the earworm in your
              head.
            </p>
          </ThoughtBubble>

          <div className="hand-drawn w-full p-4 mt-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={replacementSong.albumArt}
                  alt={`${replacementSong.album} cover`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{replacementSong.name}</h3>
                <p className="text-sm opacity-80">
                  {replacementSong.artist} • {replacementSong.album}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--highlight-color)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1 opacity-70">
                <span>
                  0:
                  {Math.floor((progress / 100) * 180)
                    .toString()
                    .padStart(2, "0")}
                </span>
                <span>3:00</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handlePlayPause}
                className="rounded-full w-12 h-12 flex items-center justify-center"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </Button>
            </div>
          </div>
        </>
      )}

      {progress === 100 && (
        <Button onClick={onPlaybackComplete} size="lg" className="mt-4">
          Did it work?
        </Button>
      )}

      {stage === "intro" && (
        <Button onClick={handlePlayPause} size="lg">
          Play Replacement Song
        </Button>
      )}
    </div>
  );
}
