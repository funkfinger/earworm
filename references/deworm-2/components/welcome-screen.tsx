"use client"

import { Button } from "@/components/ui/button"
import { Worm } from "@/components/ui/worm"
import { HandWritten } from "@/components/ui/hand-written"
import { ThoughtBubble } from "@/components/ui/thought-bubble"

interface WelcomeScreenProps {
  onNext: () => void
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-full p-6 bg-primary">
      <div className="w-full max-w-md mx-auto pt-10">
        <div className="relative mb-10">
          <div className="absolute -top-12 right-0">
            <Worm className="w-32 h-32 transform -scale-x-100" />
          </div>
          <ThoughtBubble>
            <HandWritten tag="h2" className="text-2xl mb-4 text-accent-pink">
              Hi there! I'm QT!
            </HandWritten>
            <HandWritten tag="p" className="text-lg text-primary">
              Got a song stuck in your head? I totally get it! Those pesky earworms can drive you bananas!
            </HandWritten>
            <HandWritten tag="p" className="text-lg mt-4 text-primary">
              I'm here to help you replace that stuck song with something even catchier!
            </HandWritten>
          </ThoughtBubble>
        </div>

        <div className="mt-8">
          <ThoughtBubble>
            <HandWritten tag="p" className="text-lg text-primary">
              Let's get started by logging into your Spotify account so we can find the perfect replacement song!
            </HandWritten>
          </ThoughtBubble>
        </div>
      </div>

      <div className="w-full flex justify-center mt-12 mb-8">
        <Button onClick={onNext} className="text-xl">
          Let's Go!
        </Button>
      </div>
    </div>
  )
}

