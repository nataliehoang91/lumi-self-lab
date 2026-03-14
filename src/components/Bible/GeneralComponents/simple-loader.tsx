"use client";

import { cn } from "@/lib/utils";

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
  const dotSizeMap = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };

  const sizeMap = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-24 w-24",
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
              className="text-border opacity-30 theme-warm:text-second-300/50"
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
              className="text-primary theme-warm:text-second animate-spin"
              style={{
                animationDuration: "2.5s",
                animationTimingFunction: "linear",
              }}
            />
          </svg>
        </div>
        {text && (
          <p
            className={cn(
              "text-muted-foreground theme-warm:text-second-800",
              textSizeMap[size]
            )}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    const dotDefaultClasses = [
      "bg-primary/90",
      "bg-second/90",
      "bg-coral/90",
      "bg-second/90",
      "bg-primary/90",
    ];
    const dotThemeWarmClasses = [
      "theme-warm:bg-second-300",
      "theme-warm:bg-second-500",
      "theme-warm:bg-second-600",
      "theme-warm:bg-second-500",
      "theme-warm:bg-second-300",
    ];

    return (
      <div className={containerClass}>
        <div className={cn(sizeMap[size], "flex items-center justify-center")}>
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  dotSizeMap[size],
                  "rounded-full",
                  dotDefaultClasses[i],
                  dotThemeWarmClasses[i]
                )}
                style={{
                  animation: `pulse 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
        {text && (
          <p
            className={cn(
              "text-muted-foreground theme-warm:text-second-800",
              textSizeMap[size]
            )}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  // pulse variant
  return (
    <div className={containerClass}>
      <div
        className={cn(
          sizeMap[size],
          "bg-primary theme-warm:bg-second rounded-full transition-opacity"
        )}
        style={{
          animation: `pulse 2s ease-in-out infinite`,
        }}
      />
      {text && (
        <p
          className={cn(
            "text-muted-foreground theme-warm:text-second-800",
            textSizeMap[size]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}

// Export convenience components
export const SingleLoader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => (
  <Loader size={size} variant="spinner" />
);

export function SimpleLoader() {
  return <Loader size="lg" variant="dots" fullHeight text="" />;
}

// Alias used by existing code in SyncedRead
export function ReadInlineSpinner() {
  return <Loader size="sm" variant="spinner" />;
}
