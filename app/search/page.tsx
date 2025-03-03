"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-primary text-primary-foreground"
      role="main"
    >
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-foreground squiggly-underline inline-block font-playpen">
            Search for Your Earworm
          </h1>

          <div className="relative w-32 h-32 mx-auto my-6 animate-in zoom-in duration-1000">
            <Image
              src="/images/worm.svg"
              alt="Worm Mascot"
              fill
              className="object-contain"
              priority
            />
          </div>

          <p className="mt-4 text-accent-a font-playpen">
            Great! Now let&apos;s find that song that&apos;s stuck in your head.
          </p>

          <form onSubmit={handleSearch} className="mt-8 space-y-4">
            <Input
              type="text"
              placeholder="Enter song name, artist, or lyrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-accent-b/30 border-secondary/20 text-primary-foreground placeholder:text-accent-a font-playpen"
            />
            <Button
              type="submit"
              size="lg"
              className="w-full bg-secondary hover:bg-secondary-hover text-primary font-playpen"
            >
              Search
            </Button>
          </form>

          <Card className="mt-8 bg-accent-b/30 border-secondary/20">
            <CardContent className="p-4">
              <p className="text-sm text-primary-foreground font-playpen">
                This is a placeholder for the search screen. In a complete
                implementation, you would be able to search for songs using the
                Spotify API.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
