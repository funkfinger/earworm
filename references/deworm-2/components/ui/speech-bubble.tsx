import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SpeechBubbleProps extends ComponentProps<"div"> {
  children: ReactNode
}

export function SpeechBubble({ children, className, ...props }: SpeechBubbleProps) {
  return (
    <div className={cn("relative p-6 speech-bubble", className)} {...props}>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

