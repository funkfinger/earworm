import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface HandDrawnBubbleProps extends ComponentProps<"div"> {
  children: ReactNode
  direction?: "left" | "right"
}

export function HandDrawnBubble({ children, className, direction = "left", ...props }: HandDrawnBubbleProps) {
  return (
    <div
      className={cn(
        "relative p-6 hand-drawn-bubble",
        direction === "left" ? "hand-drawn-bubble-left" : "hand-drawn-bubble-right",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

