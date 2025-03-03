"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import WormMascot from "@/components/worm-mascot"
import { Play, Pause, SkipForward, Volume2, Music } from "lucide-react"

interface PlaybackScreenProps {
  earwormSong: string
  onNext: (replacementSong: any) => void
}

export default function PlaybackScreen({ earwormSong, onNext }: PlaybackScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedSong, setSelectedSong] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading replacement song suggestions
    const mockSuggestions = [
      "Watermelon Sugar - Harry Styles",
      "Blinding Lights - The Weeknd",
      "As It Was - Harry Styles",
      "Stay - The Kid LAROI & Justin Bieber",
    ]

    setTimeout(() => {
      setSuggestions(mockSuggestions)
    }, 1000)

    // Cleanup timer on unmount
    return () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 30) {
            setIsPlaying(false)
            return 30
          }
          return prev + 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSelectSong = (song: string) => {
    setSelectedSong(song)
  }

  const handleContinue = () => {
    onNext(selectedSong || suggestions[0])
  }

  return (
    <Card className="border-highlight">
      <CardHeader className="text-center">
        <CardTitle className="text-highlight">Play a Replacement</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <WormMascot size="md" emotion="excited" />

        <div className="text-center space-y-4 w-full">
          <p>Great! Now let's play a different song to replace "{earwormSong}" in your head.</p>

          <div className="bg-card/50 rounded-lg p-4">
            <p className="text-sm mb-3">
              Science suggests that listening to a different catchy song can help replace the earworm!
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium">Try one of these songs:</p>

              {suggestions.length === 0 ? (
                <div className="flex justify-center py-4">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-highlight rounded-full"></div>
                    <div className="h-2 w-2 bg-highlight rounded-full"></div>
                    <div className="h-2 w-2 bg-highlight rounded-full"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {suggestions.map((song, index) => (
                    <button
                      key={index}
                      className={`flex items-center w-full p-3 transition-colors text-left rounded-md ${
                        selectedSong === song ? "bg-highlight text-primary-foreground" : "hover:bg-highlight/20"
                      }`}
                      onClick={() => handleSelectSong(song)}
                    >
                      <Music className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{song}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedSong && (
            <div className="bg-card rounded-lg p-4 mt-4">
              <p className="font-medium mb-2">{selectedSong}</p>

              <div className="flex items-center justify-between mb-2">
                <Button variant="ghost" size="icon" onClick={handlePlayPause} className="h-10 w-10 rounded-full">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <div className="flex-1 mx-4">
                  <div className="h-2 bg-accent-a/30 rounded-full overflow-hidden">
                    <div className="h-full bg-highlight" style={{ width: `${(currentTime / 30) * 100}%` }}></div>
                  </div>
                </div>

                <Volume2 className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, "0")}
                </span>
                <span>0:30</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <Button onClick={handleContinue} size="lg" className="w-full max-w-xs" disabled={suggestions.length === 0}>
          <SkipForward className="mr-2 h-4 w-4" />
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}

