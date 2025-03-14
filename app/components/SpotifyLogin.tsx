"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

const SpotifyLogin: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "missing_credentials":
          setError("Server configuration error. Please try again later.");
          break;
        case "auth_error":
          setError("Failed to connect to Spotify. Please try again.");
          break;
        default:
          setError("An error occurred. Please try again.");
      }
    }
  }, [searchParams]);

  const handleLogin = async () => {
    try {
      // Use router.push for client-side navigation
      router.push("/api/auth/spotify");
    } catch (error) {
      console.error("Failed to initiate Spotify login:", error);
      setError("Failed to connect to Spotify. Please try again.");
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
          {error && (
            <p className="text-red-500 text-sm mt-2 font-playpen">{error}</p>
          )}
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
