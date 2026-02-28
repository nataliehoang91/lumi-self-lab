"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  horizontal?: boolean;
  className?: string;
  showProgress?: boolean;
}

export function CardSkeleton({
  horizontal = false,
  className = "",
  showProgress = true,
}: CardSkeletonProps) {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Simulate loading progress on client-only
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + Math.random() * 30;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn("shrink-0 w-full min-w-0 max-w-full sm:min-w-md sm:max-w-lg", className)}>
      {/* Card skeleton container */}
      <div
        className={cn(
          "w-full rounded-2xl bg-card border border-border overflow-hidden relative",
          horizontal ? "aspect-4/3 max-h-[280px]" : "h-[280px] sm:h-[320px]"
        )}
      >
        {/* Animated background shimmer */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            animation: "shimmer 2s infinite",
            pointerEvents: "none",
          }}
        />

        {/* Content skeleton lines (only in non-horizontal mode) */}
        {!horizontal && (
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded"
                style={{
                  width: `${100 - i * 15}%`,
                  height: "10px",
                  background: "var(--skeleton-base)",
                  animation: `skeleton-pulse 1.8s ease-in-out infinite`,
                  animationDelay: `${i * 0.06}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Minimal progress bar */}
      {showProgress && (
        <div className="mt-2 h-0.5 bg-muted/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <style>{`
        :root {
          --skeleton-base: oklch(0.88 0.006 85);
        }
        .dark {
          --skeleton-base: oklch(0.26 0.008 85);
        }
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
