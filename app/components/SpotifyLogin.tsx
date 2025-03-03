"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 bg-primary border-secondary/20">
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-primary-foreground font-playpen">
            Connect to Spotify
          </h2>
          <p className="text-accent-a font-playpen">
            Link your Spotify account to get started
          </p>
        </div>

        <Button
          onClick={handleLogin}
          size="lg"
          className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white flex items-center justify-center gap-3 font-playpen"
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

        <p className="text-xs text-center text-accent-a font-playpen">
          By connecting, you agree to our{" "}
          <a href="/terms" className="text-secondary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-secondary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
};

export default SpotifyLogin;
