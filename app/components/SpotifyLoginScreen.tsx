"use client";

import { Mascot } from "./Mascot";
import { ThoughtBubble } from "./ThoughtBubble";
import { Button } from "./ui/Button";
import { FaSpotify } from "react-icons/fa";

interface SpotifyLoginScreenProps {
  onLogin: () => void;
}

export function SpotifyLoginScreen({ onLogin }: SpotifyLoginScreenProps) {
  // In a real implementation, this would redirect to Spotify OAuth
  const handleLoginClick = () => {
    // Mock implementation - in a real app, this would redirect to Spotify auth
    console.log("Redirecting to Spotify login...");
    onLogin();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Mascot size="md" animation="wiggle" />

      <ThoughtBubble>
        <h2 className="text-2xl font-bold mb-2">Let&apos;s get started!</h2>
        <p className="mb-4">
          To help cure your earworm, I&apos;ll need to connect to your Spotify
          account.
        </p>
        <p>
          This will let me play the perfect replacement song to get that tune
          out of your head!
        </p>
      </ThoughtBubble>

      <Button
        onClick={handleLoginClick}
        size="lg"
        className="flex items-center gap-2 bg-[#1DB954] hover:bg-[#1ed760]"
      >
        <FaSpotify className="text-xl" />
        Login with Spotify
      </Button>

      <p className="text-sm text-[var(--text-color)] opacity-80 max-w-xs text-center mt-4">
        We only use your Spotify account to search for songs and play music. We
        don&apos;t store your password or personal information.
      </p>
    </div>
  );
}
