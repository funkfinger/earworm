import Image from "next/image";
import { HTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";

interface MascotProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  animation?: "wiggle" | "bounce" | "none";
}

export function Mascot({
  size = "md",
  animation = "none",
  className,
  ...props
}: MascotProps) {
  const sizeMap = {
    sm: { width: 96, height: 96 },
    md: { width: 160, height: 160 },
    lg: { width: 240, height: 240 },
  };

  const animationClasses = {
    wiggle: "wiggle",
    bounce: "bounce",
    none: "",
  };

  const { width, height } = sizeMap[size];

  return (
    <div
      className={cn(
        `w-[${width}px] h-[${height}px]`,
        animationClasses[animation],
        "relative",
        className
      )}
      style={{ width: `${width}px`, height: `${height}px` }}
      {...props}
    >
      <Image
        src="/images/mascot.svg"
        alt="QT the Worm"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </div>
  );
}
