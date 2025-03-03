import React from "react";

type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  fullWidth?: boolean;
};

const Button = ({
  onClick,
  children,
  variant = "primary",
  disabled = false,
  className = "",
  size = "md",
  icon,
  fullWidth = false,
}: ButtonProps) => {
  const baseClasses =
    "relative font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl active:translate-y-0.5";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-highlight text-text hover:bg-highlight-hover focus:ring-highlight/50 hand-drawn-border",
    secondary:
      "bg-accent-b text-text hover:bg-accent-b-hover focus:ring-accent-b/50 hand-drawn-border",
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`
        ${baseClasses} 
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${disabled ? "opacity-50 cursor-not-allowed" : "bounce-settle"} 
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      tabIndex={0}
      aria-disabled={disabled}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>
    </button>
  );
};

export default Button;
