"use client"

import { useState } from "react"
import WelcomeScreen from "@/components/screens/welcome-screen"
import LoginScreen from "@/components/screens/login-screen"
import SearchScreen from "@/components/screens/search-screen"
import PlaybackScreen from "@/components/screens/playback-screen"
import FollowupScreen from "@/components/screens/followup-screen"

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [earwormSong, setEarwormSong] = useState("")
  const [replacementSong, setReplacementSong] = useState(null)

  const steps = [
    <WelcomeScreen key="welcome" onNext={() => setCurrentStep(1)} />,
    <LoginScreen key="login" onNext={() => setCurrentStep(2)} />,
    <SearchScreen
      key="search"
      onNext={(song) => {
        setEarwormSong(song)
        setCurrentStep(3)
      }}
    />,
    <PlaybackScreen
      key="playback"
      earwormSong={earwormSong}
      onNext={(song) => {
        setReplacementSong(song)
        setCurrentStep(4)
      }}
    />,
    <FollowupScreen
      key="followup"
      earwormSong={earwormSong}
      replacementSong={replacementSong}
      onReset={() => {
        setCurrentStep(0)
        setEarwormSong("")
        setReplacementSong(null)
      }}
    />,
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md mx-auto">{steps[currentStep]}</div>
    </main>
  )
}

