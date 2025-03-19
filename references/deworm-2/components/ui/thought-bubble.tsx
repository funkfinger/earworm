import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ThoughtBubbleProps extends ComponentProps<"div"> {
  children: ReactNode
  direction?: "left" | "right"
}

export function ThoughtBubble({ children, className, direction = "left", ...props }: ThoughtBubbleProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      <div className="thought-bubble">
        <div className="p-4 sm:p-6">{children}</div>
      </div>
      <div className={cn("thought-dots", direction === "left" ? "thought-dots-left" : "thought-dots-right")}></div>
    </div>
  )
}

