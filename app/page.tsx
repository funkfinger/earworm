"use client";

import { useEffect, useState } from "react";
import { Mascot } from "./components/Mascot";
import { ThoughtBubble } from "./components/ThoughtBubble";
import { Button } from "./components/ui/Button";
import { SpotifyLoginScreen } from "./components/SpotifyLoginScreen";
import { SearchScreen } from "./components/SearchScreen";
import { PlaybackScreen } from "./components/PlaybackScreen";
import { ConfirmationScreen } from "./components/ConfirmationScreen";

// Define the Song type
interface Song {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
}

// Define all possible screens in the app
type Screen =
  | "splash"
  | "welcome"
  | "login"
  | "search"
  | "playback"
  | "confirmation";

export default function Home() {
  // Track the current screen
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");

  // Track the selected earworm song
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  // Auto-transition from splash to welcome after 2 seconds
  useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        setCurrentScreen("welcome");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Handle navigation between screens
  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  // Handle song selection
  const handleSongSelected = (song: Song) => {
    setSelectedSong(song);
    navigateTo("playback");
  };

  // Handle confirmation of whether the replacement worked
  const handleConfirmation = (worked: boolean) => {
    console.log(`Replacement song ${worked ? "worked" : "didn't work"}`);
    // In a real app, this would send data to the backend
    navigateTo("search");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-md mx-auto p-4">
      {currentScreen === "splash" && <SplashScreen />}

      {currentScreen === "welcome" && (
        <WelcomeScreen onContinue={() => navigateTo("login")} />
      )}

      {currentScreen === "login" && (
        <SpotifyLoginScreen onLogin={() => navigateTo("search")} />
      )}

      {currentScreen === "search" && (
        <SearchScreen onSongSelected={handleSongSelected} />
      )}

      {currentScreen === "playback" && selectedSong && (
        <PlaybackScreen
          earwormSong={selectedSong}
          onPlaybackComplete={() => navigateTo("confirmation")}
        />
      )}

      {currentScreen === "confirmation" && (
        <ConfirmationScreen onConfirm={handleConfirmation} />
      )}
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-4xl font-bold text-[var(--highlight-color)]">
        De Worm
      </h1>
      <Mascot size="lg" animation="bounce" />
      <p className="text-xl">Your earworm cure!</p>
    </div>
  );
}

function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Mascot size="md" animation="wiggle" />

      <ThoughtBubble>
        <h2 className="text-2xl font-bold mb-2">Hi there! I&apos;m QT!</h2>
        <p className="mb-4">
          Got a song stuck in your head? I can help you get rid of that pesky
          earworm!
        </p>
        <p>
          I&apos;ll play you a different catchy song that will replace the one
          that&apos;s stuck in your head.
        </p>
      </ThoughtBubble>

      <Button onClick={onContinue} size="lg">
        Let&apos;s Go!
      </Button>
    </div>
  );
}
