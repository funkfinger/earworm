import { Worm } from "@/components/ui/worm"
import { HandWritten } from "@/components/ui/hand-written"

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full h-screen p-6 bg-primary">
      <div className="relative w-64 h-64 animate-bounce-subtle">
        <Worm className="w-full h-full" />
      </div>
      <HandWritten tag="h1" className="text-6xl text-accent-pink animate-wiggle">
        DeWorm
      </HandWritten>
      <HandWritten tag="p" className="text-2xl text-text animate-fade-in">
        The Earworm Cure
      </HandWritten>
    </div>
  )
}

