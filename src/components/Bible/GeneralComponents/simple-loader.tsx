"use client";

import { cn } from "@/lib/utils";

import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse";
  text?: string;
  fullHeight?: boolean;
  className?: string;
}

/**
 * Elegant custom loader component with subtle animation
 * Variants: spinner (circular arc), dots (dotted circle), pulse (smooth fade)
 */
export function Loader({
  size = "md",
  variant = "spinner",
  text,
  fullHeight = false,
  className,
}: LoaderProps) {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  const textSizeMap = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const containerClass = cn(
    "flex flex-col items-center justify-center gap-3",
    fullHeight && "min-h-[calc(100vh-5rem)]",
    className
  );

  if (variant === "spinner") {
    return (
      <div className={containerClass}>
        <div className={cn(sizeMap[size], "relative")}>
          <svg
            viewBox="0 0 50 50"
            className="h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background circle */}
            <circle
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="2"
              className="text-border opacity-30"
            />
            {/* Animated arc */}
            <circle
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="31.4 125.6"
              className="text-primary animate-spin"
              style={{
                animationDuration: "2.5s",
                animationTimingFunction: "linear",
              }}
            />
          </svg>
        </div>
        {text && <p className={cn("text-muted-foreground", textSizeMap[size])}>{text}</p>}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={containerClass}>
        <div className={cn(sizeMap[size], "flex items-center justify-center")}>
          <div className="flex gap-1.5">
            {(() => {
              const dotColors = [
                "oklch(0.76 0.12 35 / 0.95)",
                "oklch(0.66 0.15 270 / 0.95)",
                "oklch(0.68 0.14 25 / 0.95)",
              ];

              return [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: dotColors[i % dotColors.length],
                    animation: `pulse 1.5s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                    opacity: 1,
                  }}
                />
              ));
            })()}
          </div>
        </div>
        {text && <p className={cn("text-muted-foreground", textSizeMap[size])}>{text}</p>}
      </div>
    );
  }

  // pulse variant
  return (
    <div className={containerClass}>
      <div
        className={cn(sizeMap[size], "bg-primary rounded-full transition-opacity")}
        style={{
          animation: `pulse 2s ease-in-out infinite`,
        }}
      />
      {text && <p className={cn("text-muted-foreground", textSizeMap[size])}>{text}</p>}
    </div>
  );
}

// Export convenience components
export const SingleLoader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => (
  <Loader size={size} variant="spinner" />
);

export function SimpleLoader() {
  return <Loader size="lg" variant="dots" fullHeight text="Loading..." />;
}

// Alias used by existing code in SyncedRead
export function ReadInlineSpinner() {
  return <Loader size="sm" variant="spinner" />;
}
