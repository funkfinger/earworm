import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import WormMascot from "@/components/worm-mascot"
import { Music } from "lucide-react"

interface WelcomeScreenProps {
  onNext: () => void
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <Card className="border-highlight">
      <CardHeader className="text-center">
        <CardTitle className="text-highlight">Welcome to Earworm Remover!</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <WormMascot animate size="lg" emotion="happy" />

        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Got a song stuck in your head?</h2>
          <p>
            I know how annoying that can be! An earworm can drive you crazy, but don't worry - I'm here to help you get
            rid of it.
          </p>

          <div className="flex items-center justify-center space-x-2 text-highlight">
            <Music className="h-5 w-5" />
            <span className="font-medium">Let's replace that earworm together!</span>
            <Music className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <Button onClick={onNext} size="lg" className="w-full max-w-xs">
          Let's Get Started
        </Button>
      </CardFooter>
    </Card>
  )
}

