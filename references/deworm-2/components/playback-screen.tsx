"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Worm } from "@/components/ui/worm"
import { HandWritten } from "@/components/ui/hand-written"
import { ThoughtBubble } from "@/components/ui/thought-bubble"
import { useAppContext } from "@/contexts/app-context"
import { Disc, Pause, Play } from "lucide-react"

interface PlaybackScreenProps {
  onNext: () => void
}

export default function PlaybackScreen({ onNext }: PlaybackScreenProps) {
  const { earwormSong, replacementSong } = useAppContext()
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const songDuration = 30 // 30 seconds for demo purposes

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setElapsed((prev) => {
          const newElapsed = prev + 0.1
          if (newElapsed >= songDuration) {
            setIsPlaying(false)
            return songDuration
          }
          return newElapsed
        })
      }, 100)
    }

    return () => clearInterval(interval)
  }, [isPlaying])

  useEffect(() => {
    setProgress((elapsed / songDuration) * 100)
  }, [elapsed, songDuration])

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-6 bg-primary">
      <div className="w-full max-w-md mx-auto pt-6">
        <div className="relative mb-8">
          <div className="absolute -top-16 left-0">
            <Worm className="w-32 h-32" />
          </div>
          <ThoughtBubble>
            <HandWritten tag="h2" className="text-2xl mb-4 text-accent-pink">
              I've got the perfect cure!
            </HandWritten>
            <HandWritten tag="p" className="text-lg text-primary">
              {earwormSong ? (
                <>
                  To replace <span className="text-accent-pink">{earwormSong.name}</span>, I'm
                </>
              ) : (
                "I'm"
              )}{" "}
              going to play you this super catchy song!
            </HandWritten>
          </ThoughtBubble>
        </div>

        {replacementSong && (
          <div className="mt-8 w-full">
            <div className="w-full bg-primary-dark p-6 rounded-xl border-4 border-accent-a squiggle-border">
              <div className="flex justify-center mb-6">
                <div className="w-56 h-56 relative">
                  <div
                    className={`absolute inset-0 rounded-lg bg-accent-pink/20 flex items-center justify-center ${isPlaying ? "animate-record-spin" : ""}`}
                  >
                    {replacementSong.albumArt ? (
                      <img
                        src={replacementSong.albumArt || "/placeholder.svg"}
                        alt={replacementSong.name}
                        className="w-full h-full rounded-lg"
                      />
                    ) : (
                      <Disc className="w-32 h-32 text-accent-pink" />
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <HandWritten tag="h3" className="text-2xl text-accent-pink mb-1">
                  {replacementSong.name}
                </HandWritten>
                <HandWritten tag="p" className="text-lg text-text">
                  {replacementSong.artist}
                </HandWritten>
              </div>

              <div className="mb-4">
                <div className="w-full h-3 bg-primary-light rounded-full overflow-hidden">
                  <div className="h-full bg-accent-pink" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between mt-1">
                  <HandWritten tag="span" className="text-sm text-text">
                    {formatTime(elapsed)}
                  </HandWritten>
                  <HandWritten tag="span" className="text-sm text-text">
                    {formatTime(songDuration)}
                  </HandWritten>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Button onClick={togglePlayback} size="lg" className="rounded-full w-16 h-16 p-0 text-xl">
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex justify-center mt-auto mb-8">
        <Button onClick={onNext} className="text-xl">
          I've Listened!
        </Button>
      </div>
    </div>
  )
}

