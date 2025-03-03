import React from "react";
import Image from "next/image";

export default function SearchPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground squiggly-underline inline-block">
            Search for Your Earworm
          </h1>

          <div className="relative w-32 h-32 mx-auto my-6">
            <Image
              src="/images/qt-mascot.svg"
              alt="QT Mascot"
              fill
              className="object-contain"
              priority
            />
          </div>

          <p className="mt-4">
            Great! Now let&apos;s find that song that&apos;s stuck in your head.
          </p>

          <div className="hand-drawn-border p-4 mt-6 bg-background/30">
            <p className="text-sm">
              This is a placeholder for the search screen. In a complete
              implementation, you would be able to search for songs using the
              Spotify API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
