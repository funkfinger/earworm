import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface ThoughtBubbleProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function ThoughtBubble({
  children,
  className,
  ...props
}: ThoughtBubbleProps) {
  return (
    <div
      className={cn(
        "thought-bubble hand-drawn max-w-md mx-auto text-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
