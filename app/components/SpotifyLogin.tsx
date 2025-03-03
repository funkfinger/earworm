"use client";

import React from "react";
import Button from "./Button";
import Image from "next/image";

const SpotifyLogin: React.FC = () => {
  const handleLogin = () => {
    try {
      // Redirect to our API endpoint that will handle Spotify OAuth
      window.location.assign("/api/auth/spotify");
    } catch (error) {
      console.error("Failed to initiate Spotify login:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={handleLogin}
        variant="primary"
        size="lg"
        fullWidth
        className="flex items-center justify-center gap-3"
      >
        <div className="relative w-6 h-6">
          <Image
            src="/images/spotify-logo.svg"
            alt="Spotify Logo"
            fill
            className="object-contain"
          />
        </div>
        Connect with Spotify
      </Button>

      <p className="text-xs mt-4 text-foreground/70">
        By connecting, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default SpotifyLogin;
