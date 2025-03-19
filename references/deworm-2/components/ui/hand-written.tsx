import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type HandWrittenProps = {
  children: ReactNode
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
  className?: string
}

export function HandWritten({ children, tag, className, ...props }: HandWrittenProps) {
  const Tag = tag

  return (
    <Tag className={cn("font-playpen text-wiggle", className)} {...props}>
      {children}
    </Tag>
  )
}

