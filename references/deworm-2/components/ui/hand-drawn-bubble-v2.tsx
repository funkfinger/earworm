import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface HandDrawnBubbleProps extends ComponentProps<"div"> {
  children: ReactNode
  direction?: "left" | "right"
}

export function HandDrawnBubble({ children, className, direction = "left", ...props }: HandDrawnBubbleProps) {
  return (
    <div className="relative">
      <div
        className={cn("relative p-6 bg-primary-light", className)}
        style={{
          borderRadius: "30px",
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: "var(--accent-a)",
          boxShadow:
            "2px 2px 0 var(--accent-a), -2px 2px 0 var(--accent-a), 2px -2px 0 var(--accent-a), -2px -2px 0 var(--accent-a)",
          borderTopLeftRadius: direction === "left" ? "5px" : "30px",
          borderBottomRightRadius: direction === "right" ? "5px" : "30px",
        }}
        {...props}
      >
        {children}
      </div>

      {direction === "left" && (
        <div
          className="absolute w-4 h-4 bg-primary-light"
          style={{
            bottom: "15px",
            left: "-8px",
            transform: "rotate(45deg)",
            borderLeft: "3px solid var(--accent-a)",
            borderBottom: "3px solid var(--accent-a)",
            boxShadow: "-2px 2px 0 var(--accent-a)",
          }}
        />
      )}

      {direction === "right" && (
        <div
          className="absolute w-4 h-4 bg-primary-light"
          style={{
            bottom: "15px",
            right: "-8px",
            transform: "rotate(45deg)",
            borderRight: "3px solid var(--accent-a)",
            borderBottom: "3px solid var(--accent-a)",
            boxShadow: "2px 2px 0 var(--accent-a)",
          }}
        />
      )}
    </div>
  )
}

