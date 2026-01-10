import type React from "react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "full";
}

export function Container({
  children,
  className,
  as: Component = "div",
  maxWidth = "7xl",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "w-full mx-auto",
        {
          "max-w-sm": maxWidth === "sm",
          "max-w-md": maxWidth === "md",
          "max-w-lg": maxWidth === "lg",
          "max-w-xl": maxWidth === "xl",
          "max-w-2xl": maxWidth === "2xl",
          "max-w-3xl": maxWidth === "3xl",
          "max-w-4xl": maxWidth === "4xl",
          "max-w-5xl": maxWidth === "5xl",
          "max-w-6xl": maxWidth === "6xl",
          "max-w-7xl": maxWidth === "7xl",
          "max-w-8xl": maxWidth === "8xl",
          "max-w-full": maxWidth === "full",
        },
        className
      )}
    >
      {children}
    </Component>
  );
}
