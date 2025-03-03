"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import WormMascot from "@/components/worm-mascot"
import { Search, Music, Loader2 } from "lucide-react"

interface SearchScreenProps {
  onNext: (song: string) => void
}

export default function SearchScreen({ onNext }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<string[]>([])

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate search results
    setTimeout(() => {
      const mockResults = [
        `${searchQuery} - Taylor Swift`,
        `${searchQuery} (Remix) - Drake`,
        `${searchQuery} - The Weeknd`,
        `${searchQuery} - Billie Eilish`,
      ]
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleSongSelect = (song: string) => {
    onNext(song)
  }

  return (
    <Card className="border-accent-b">
      <CardHeader className="text-center">
        <CardTitle className="text-accent-b">Find Your Earworm</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <WormMascot size="md" emotion="thinking" />

        <div className="text-center space-y-4 w-full">
          <p>What song is stuck in your head? Let's find it so we can help you get rid of it.</p>

          <div className="flex w-full max-w-sm mx-auto">
            <Input
              type="text"
              placeholder="Search for a song or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="rounded-r-none"
            />
            <Button
              type="submit"
              onClick={handleSearch}
              className="rounded-l-none"
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {isSearching && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-highlight" />
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-sm font-medium">Select your earworm:</p>
              <div className="bg-card/50 rounded-lg overflow-hidden">
                {searchResults.map((song, index) => (
                  <button
                    key={index}
                    className="flex items-center w-full p-3 hover:bg-highlight/20 transition-colors text-left border-b border-border/30 last:border-0"
                    onClick={() => handleSongSelect(song)}
                  >
                    <Music className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{song}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        {searchResults.length === 0 && (
          <Button variant="outline" onClick={() => onNext("Unknown Song")} className="w-full max-w-xs">
            I'm not sure what it's called
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

