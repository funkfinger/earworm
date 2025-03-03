"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import WormMascot from "@/components/worm-mascot"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface LoginScreenProps {
  onNext: () => void
}

export default function LoginScreen({ onNext }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSpotifyLogin = () => {
    setIsLoading(true)
    // In a real app, this would redirect to Spotify OAuth
    setTimeout(() => {
      setIsLoading(false)
      onNext()
    }, 1500)
  }

  return (
    <Card className="border-accent-a">
      <CardHeader className="text-center">
        <CardTitle className="text-accent-a">Connect to Spotify</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <WormMascot size="md" emotion="thinking" />

        <div className="text-center space-y-4">
          <p>
            To help you get rid of that earworm, I'll need to connect to your Spotify account. This will let us find the
            song that's stuck in your head and play a replacement.
          </p>

          <div className="bg-card/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">I'll only need permission to:</p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>Search for songs</li>
              <li>View your playlists</li>
              <li>Play music on your devices</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 pb-6">
        <Button
          onClick={handleSpotifyLogin}
          size="lg"
          className="w-full max-w-xs bg-[#1DB954] hover:bg-[#1DB954]/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Connect to Spotify"
          )}
        </Button>

        <Button variant="ghost" size="sm" className="text-xs" onClick={onNext}>
          Skip for now (demo mode)
        </Button>
      </CardFooter>
    </Card>
  )
}

