import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: "hand-drawn-btn bg-[var(--highlight-color)] text-white",
    secondary: "hand-drawn-btn bg-[var(--accent-color-a)] text-white",
    outline:
      "hand-drawn border-2 border-[var(--highlight-color)] bg-transparent text-[var(--highlight-color)]",
  };

  const sizeClasses = {
    sm: "text-sm py-1 px-3",
    md: "text-base py-2 px-4",
    lg: "text-lg py-3 px-6",
  };

  return (
    <button
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        "font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[var(--highlight-color)] focus:ring-opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
