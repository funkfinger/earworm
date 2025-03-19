import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-playpen text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none squiggle-border",
          variant === "default" && "bg-accent-pink hover:bg-accent-pink/90 text-white border-2 border-accent-pink-dark",
          variant === "outline" && "bg-transparent border-2 border-accent-a hover:bg-accent-a/10 text-text",
          variant === "ghost" && "bg-transparent hover:bg-accent-a/10 text-text",
          size === "default" && "h-10 py-2 px-4",
          size === "sm" && "h-9 px-3",
          size === "lg" && "h-11 px-8",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)

Button.displayName = "Button"

export { Button }

