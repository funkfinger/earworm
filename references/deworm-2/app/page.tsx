"use client"

import { useEffect, useState } from "react"
import SplashScreen from "@/components/splash-screen"
import WelcomeScreen from "@/components/welcome-screen"
import SpotifyLoginScreen from "@/components/spotify-login-screen"
import SearchScreen from "@/components/search-screen"
import PlaybackScreen from "@/components/playback-screen"
import ConfirmationScreen from "@/components/confirmation-screen"
import { AppProvider } from "@/contexts/app-context"

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show splash screen for 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
      setCurrentStep(1) // Move to welcome screen
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handleRestart = () => {
    setCurrentStep(3) // Go back to search screen
  }

  return (
    <AppProvider>
      <main className="min-h-screen flex flex-col items-center justify-center bg-primary relative overflow-hidden">
        {isLoading ? (
          <SplashScreen />
        ) : (
          <>
            {currentStep === 1 && <WelcomeScreen onNext={handleNext} />}
            {currentStep === 2 && <SpotifyLoginScreen onNext={handleNext} />}
            {currentStep === 3 && <SearchScreen onNext={handleNext} />}
            {currentStep === 4 && <PlaybackScreen onNext={handleNext} />}
            {currentStep === 5 && <ConfirmationScreen onRestart={handleRestart} />}
          </>
        )}
      </main>
    </AppProvider>
  )
}

