"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Worm } from "@/components/ui/worm"
import { HandWritten } from "@/components/ui/hand-written"
import { ThoughtBubble } from "@/components/ui/thought-bubble"
import { useAppContext } from "@/contexts/app-context"
import { toast } from "@/components/ui/toast"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface ConfirmationScreenProps {
  onRestart: () => void
}

export default function ConfirmationScreen({ onRestart }: ConfirmationScreenProps) {
  const { earwormSong, replacementSong } = useAppContext()
  const [answered, setAnswered] = useState(false)

  const handleResponse = (worked: boolean) => {
    setAnswered(true)

    if (worked) {
      toast({
        title: "Woohoo!",
        description: "I'm so glad I could help! Let's save this for future wormies!",
        variant: "success",
      })
    } else {
      toast({
        title: "Aw, bummer!",
        description: "Let's try again with a different song!",
        variant: "default",
      })
    }

    // Simulate saving the result to the database
    setTimeout(() => {
      onRestart()
    }, 2500)
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
              Did it work?
            </HandWritten>
            <HandWritten tag="p" className="text-lg text-primary">
              {earwormSong && replacementSong ? (
                <>
                  Did <span className="text-accent-pink">{replacementSong.name}</span> successfully replace{" "}
                  <span className="text-accent-pink">{earwormSong.name}</span> in your head?
                </>
              ) : (
                "Did the new song replace your earworm?"
              )}
            </HandWritten>
          </ThoughtBubble>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <HandWritten tag="p" className="text-xl text-text text-center mb-8">
            Let me know if your earworm is gone!
          </HandWritten>

          <div className="flex gap-6">
            <Button
              onClick={() => handleResponse(true)}
              className="flex-col h-auto py-6 px-8 text-xl"
              disabled={answered}
            >
              <ThumbsUp className="w-12 h-12 mb-2" />
              <HandWritten tag="span" className="text-lg">
                Yes, it worked!
              </HandWritten>
            </Button>

            <Button
              onClick={() => handleResponse(false)}
              variant="outline"
              className="flex-col h-auto py-6 px-8 text-xl"
              disabled={answered}
            >
              <ThumbsDown className="w-12 h-12 mb-2" />
              <HandWritten tag="span" className="text-lg">
                Still stuck...
              </HandWritten>
            </Button>
          </div>
        </div>
      </div>

      {answered && (
        <div className="w-full flex justify-center mt-12 animate-bounce-subtle">
          <HandWritten tag="p" className="text-xl text-accent-pink">
            Taking you back soon...
          </HandWritten>
        </div>
      )}
    </div>
  )
}

