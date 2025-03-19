"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Worm } from "@/components/ui/worm"
import { HandWritten } from "@/components/ui/hand-written"
import { ThoughtBubble } from "@/components/ui/thought-bubble"
import { useAppContext } from "@/contexts/app-context"
import { toast } from "@/components/ui/toast"

interface SpotifyLoginScreenProps {
  onNext: () => void
}

export default function SpotifyLoginScreen({ onNext }: SpotifyLoginScreenProps) {
  const { setIsLoggedIn } = useAppContext()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async () => {
    setIsLoggingIn(true)

    // Simulating Spotify login for the prototype
    // In a real app, we'd connect to the Spotify API here
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsLoggedIn(true)
      toast({
        title: "Success!",
        description: "You're logged in to Spotify!",
        variant: "success",
      })
      setTimeout(onNext, 1000)
    } catch (error) {
      toast({
        title: "Uh oh!",
        description: "Something went wrong with the login. Please try again!",
        variant: "error",
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-full p-6 bg-primary">
      <div className="w-full max-w-md mx-auto pt-10">
        <div className="relative mb-8">
          <div className="absolute -top-12 left-4">
            <Worm className="w-32 h-32" />
          </div>
          <ThoughtBubble>
            <HandWritten tag="h2" className="text-2xl mb-4 text-accent-pink">
              Let's connect to Spotify!
            </HandWritten>
            <HandWritten tag="p" className="text-lg text-primary">
              I'll need your Spotify account to search for songs and play your earworm cure!
            </HandWritten>
          </ThoughtBubble>
        </div>

        <div className="flex flex-col items-center justify-center mt-12 mb-8">
          <div className="w-32 h-32 mb-6 border-4 border-accent-pink rounded-full p-2 squiggle-border">
            <div className="w-full h-full rounded-full bg-[#1DB954] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-16 h-16 text-black"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-5Z"></path>
                <path d="M12 12.5v-8"></path>
                <path d="M10 7.5a5 5 0 0 1 4 0"></path>
              </svg>
            </div>
          </div>
          <HandWritten tag="p" className="text-lg text-text text-center mb-8">
            Clicking below will connect DeWorm to your Spotify account.
          </HandWritten>
        </div>
      </div>

      <div className="w-full flex justify-center mt-6 mb-8">
        <Button onClick={handleLogin} disabled={isLoggingIn} className="text-xl">
          {isLoggingIn ? "Connecting..." : "Connect to Spotify"}
        </Button>
      </div>
    </div>
  )
}

