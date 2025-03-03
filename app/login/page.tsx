import React from "react";
import SpotifyLogin from "../components/SpotifyLogin";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground squiggly-underline inline-block">
            Connect with Spotify
          </h1>

          <p className="mt-6">
            To help cure your earworm, we&apos;ll need to connect to your
            Spotify account.
          </p>

          <div className="hand-drawn-border p-4 mt-6 bg-background/30">
            <p className="text-sm">
              We only use your Spotify account to search for songs and play
              music. We don&apos;t store your Spotify credentials.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <SpotifyLogin />
        </div>
      </div>
    </div>
  );
}
