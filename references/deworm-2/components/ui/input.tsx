import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border-2 border-accent-pink bg-primary-light px-3 py-2 text-sm text-text file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 squiggle-border font-playpen",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }

