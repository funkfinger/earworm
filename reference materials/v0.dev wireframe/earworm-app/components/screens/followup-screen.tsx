"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import WormMascot from "@/components/worm-mascot"
import { Check, X, RefreshCw } from "lucide-react"
import { useState } from "react"

interface FollowupScreenProps {
  earwormSong: string
  replacementSong: any
  onReset: () => void
}

export default function FollowupScreen({ earwormSong, replacementSong, onReset }: FollowupScreenProps) {
  const [feedback, setFeedback] = useState<"success" | "failure" | null>(null)
  const [showTips, setShowTips] = useState(false)

  const handleSuccess = () => {
    setFeedback("success")
  }

  const handleFailure = () => {
    setFeedback("failure")
    setShowTips(true)
  }

  return (
    <Card className={feedback === "success" ? "border-green-500" : "border-accent-a"}>
      <CardHeader className="text-center">
        <CardTitle className={feedback === "success" ? "text-green-500" : "text-accent-a"}>
          {feedback === "success" ? "Success!" : "Did It Work?"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <WormMascot
          size="md"
          emotion={feedback === "success" ? "happy" : "thinking"}
          animate={feedback === "success"}
        />

        <div className="text-center space-y-4 w-full">
          {!feedback ? (
            <>
              <p>
                You listened to "{replacementSong}" to replace your earworm "{earwormSong}".
              </p>
              <p className="font-medium">Did it help get rid of the earworm?</p>

              <div className="flex justify-center space-x-4 mt-4">
                <Button onClick={handleSuccess} className="bg-green-500 hover:bg-green-600 text-white" size="lg">
                  <Check className="mr-2 h-5 w-5" />
                  Yes, it worked!
                </Button>

                <Button onClick={handleFailure} variant="outline" size="lg">
                  <X className="mr-2 h-5 w-5" />
                  Not yet
                </Button>
              </div>
            </>
          ) : feedback === "success" ? (
            <>
              <div className="bg-green-500/20 text-green-500 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Great news!</h3>
                <p>You've successfully replaced your earworm. Your brain has a new song to focus on now!</p>
              </div>

              <div className="mt-4">
                <p>Remember, you can use this technique anytime you have an annoying song stuck in your head.</p>
              </div>
            </>
          ) : (
            <>
              <p>Don't worry! Earworms can be persistent. Here are some additional tips:</p>

              <div className="bg-card/50 rounded-lg p-4 text-left">
                <ul className="list-disc list-inside space-y-2">
                  <li>Try listening to the replacement song again, but for longer</li>
                  <li>Chew gum or have a snack (this can disrupt the brain's "rehearsal" of the song)</li>
                  <li>Engage in an absorbing activity that requires verbal processing</li>
                  <li>Try solving a puzzle or reading aloud</li>
                  <li>Listen to the earworm song all the way through (sometimes this helps!)</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        {feedback === "success" ? (
          <Button onClick={onReset} size="lg" className="w-full max-w-xs bg-green-500 hover:bg-green-600">
            Start Over
          </Button>
        ) : feedback === "failure" ? (
          <Button onClick={onReset} size="lg" className="w-full max-w-xs">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}

