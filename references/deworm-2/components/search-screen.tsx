"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Worm } from "@/components/ui/worm"
import { HandWritten } from "@/components/ui/hand-written"
import { ThoughtBubble } from "@/components/ui/thought-bubble"
import { useAppContext } from "@/contexts/app-context"
import type { Song } from "@/contexts/app-context"
import { FileMusicIcon as MusicNote, Search } from "lucide-react"

interface SearchScreenProps {
  onNext: () => void
}

export default function SearchScreen({ onNext }: SearchScreenProps) {
  const { setEarwormSong, setReplacementSong } = useAppContext()
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)

    // Simulate search results from Spotify API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockResults: Song[] = [
      { id: "1", name: query, artist: "Popular Artist", albumArt: "/placeholder.svg?height=60&width=60" },
      { id: "2", name: `${query} (Remix)`, artist: "DJ Somebody", albumArt: "/placeholder.svg?height=60&width=60" },
      {
        id: "3",
        name: `${query} - Acoustic`,
        artist: "Another Singer",
        albumArt: "/placeholder.svg?height=60&width=60",
      },
      {
        id: "4",
        name: `Similar to ${query}`,
        artist: "Different Band",
        albumArt: "/placeholder.svg?height=60&width=60",
      },
      { id: "5", name: `${query} Cover`, artist: "Cover Artist", albumArt: "/placeholder.svg?height=60&width=60" },
    ]

    setSearchResults(mockResults)
    setIsSearching(false)
  }

  const handleSongSelect = (song: Song) => {
    setEarwormSong(song)

    // Simulate selecting a replacement song from the earworm cure playlist
    const replacementSongs: Song[] = [
      {
        id: "r1",
        name: "Never Gonna Give You Up",
        artist: "Rick Astley",
        albumArt: "/placeholder.svg?height=60&width=60",
      },
      { id: "r2", name: "Baby Shark", artist: "Pinkfong", albumArt: "/placeholder.svg?height=60&width=60" },
      { id: "r3", name: "Call Me Maybe", artist: "Carly Rae Jepsen", albumArt: "/placeholder.svg?height=60&width=60" },
      { id: "r4", name: "Gangnam Style", artist: "PSY", albumArt: "/placeholder.svg?height=60&width=60" },
      { id: "r5", name: "Sweet Caroline", artist: "Neil Diamond", albumArt: "/placeholder.svg?height=60&width=60" },
    ]

    // Pick a random replacement song
    const randomIndex = Math.floor(Math.random() * replacementSongs.length)
    setReplacementSong(replacementSongs[randomIndex])

    onNext()
  }

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-6 bg-primary">
      <div className="w-full max-w-md mx-auto pt-6">
        <div className="relative mb-8">
          <div className="absolute -top-16 right-2">
            <Worm className="w-32 h-32 transform -scale-x-100" />
          </div>
          <ThoughtBubble direction="right">
            <HandWritten tag="h2" className="text-2xl mb-4 text-accent-pink">
              What song is stuck in your head?
            </HandWritten>
            <HandWritten tag="p" className="text-lg text-primary">
              Tell me the name or lyrics of the earworm that's been bothering you!
            </HandWritten>
          </ThoughtBubble>
        </div>

        <div className="mt-6 w-full">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a song..."
                className="w-full pl-10 text-lg"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text w-5 h-5" />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !query.trim()} className="text-xl">
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          <div className="mt-8">
            {searchResults.length > 0 ? (
              <div className="space-y-3">
                <HandWritten tag="p" className="text-lg text-accent-pink mb-2">
                  Is one of these your earworm?
                </HandWritten>
                {searchResults.map((song) => (
                  <button
                    key={song.id}
                    className="w-full flex items-center p-3 border-2 border-accent-pink rounded-lg bg-primary-light hover:bg-accent-pink/10 transition-colors squiggle-border"
                    onClick={() => handleSongSelect(song)}
                  >
                    <div className="w-12 h-12 rounded-md bg-accent-a flex items-center justify-center mr-3">
                      {song.albumArt ? (
                        <img
                          src={song.albumArt || "/placeholder.svg"}
                          alt={song.name}
                          className="w-full h-full rounded-md"
                        />
                      ) : (
                        <MusicNote className="w-6 h-6 text-text" />
                      )}
                    </div>
                    <div className="text-left">
                      <HandWritten tag="p" className="text-lg font-medium text-text line-clamp-1">
                        {song.name}
                      </HandWritten>
                      <HandWritten tag="p" className="text-sm text-muted-foreground line-clamp-1">
                        {song.artist}
                      </HandWritten>
                    </div>
                  </button>
                ))}
              </div>
            ) : query && !isSearching ? (
              <div className="text-center py-8">
                <HandWritten tag="p" className="text-lg text-text">
                  No songs found. Try a different search!
                </HandWritten>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

