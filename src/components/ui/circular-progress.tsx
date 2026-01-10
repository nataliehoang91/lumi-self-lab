import { Check } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0-100
  size?: number; // px
  strokeWidth?: number; // px
  className?: string;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
  completed?: boolean;
}

export function CircularProgress({
  value,
  size = 48,
  strokeWidth = 6,
  className = "",
  color = "#0ea5e9", // tailwind sky-500
  bgColor = "#e5e7eb", // tailwind gray-200
  children,
  completed = false,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`relative inline-block animate-pulse ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size}>
        <circle
          stroke={bgColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          style={{ transition: "stroke-dashoffset 0.5s" }}
        />
      </svg>
      {children ? (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
          {children}
        </span>
      ) : (
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center text-sm font-semibold hover:animate-[wiggle_1s_ease-in-out]"
          )}
        >
          {completed ? (
            <Check className="size-8 text-yellow-500 animate-[wiggle_1s_ease-in-out" />
          ) : (
            `${progress}%`
          )}
        </span>
      )}
    </div>
  );
}
