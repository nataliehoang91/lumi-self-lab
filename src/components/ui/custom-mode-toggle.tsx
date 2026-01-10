"use client";

import type React from "react";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CustomModeToggleProps<T extends string> {
  modes: {
    value: T;
    label: string;
    icon?: React.ReactNode;
  }[];
  defaultMode?: T;
  value?: T; // Controlled mode
  onModeChange?: (mode: T) => void;
  className?: string;
  rounded?: "pill" | "square" | "sm" | "md" | "lg" | "none";
  size?: "sm" | "md" | "lg";
  activeBgClassName?: string; // Custom className for active button background
  activeTextClassName?: string;
  inactiveTextClassName?: string;
}

const roundedVariants = {
  pill: "rounded-full",
  square: "rounded-none",
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
};

const sizeVariants = {
  sm: {
    container: "p-0.5",
    button: "px-3 py-1.5 text-xs gap-1.5 min-w-[80px]",
    icon: "w-3 h-3",
  },
  md: {
    container: "p-0.8",
    button: "px-4 py-2 text-sm gap-2 min-w-[100px]",
    icon: "w-3.5 h-3.5",
  },
  lg: {
    container: "p-1.5",
    button: "px-6 py-3 text-base gap-2 min-w-[120px]",
    icon: "w-4 h-4",
  },
};

export function CustomModeToggle<T extends string>({
  modes,
  defaultMode,
  value,
  onModeChange,
  className,
  rounded = "pill", // Default to pill shape
  size = "md", // Default to medium size
  activeBgClassName, // Custom className for active button background
  activeTextClassName,
  inactiveTextClassName,
}: CustomModeToggleProps<T>) {
  // Use controlled mode if value is provided, otherwise use uncontrolled with defaultMode
  const [internalMode, setInternalMode] = useState(
    defaultMode || modes[0]?.value
  );
  const activeMode = value !== undefined ? value : internalMode;
  const activeIndex = modes.findIndex((m) => m.value === activeMode);

  const handleToggle = (mode: T) => {
    if (value === undefined) {
      // Uncontrolled mode - update internal state
      setInternalMode(mode);
    }
    onModeChange?.(mode);
  };

  const roundedClass = roundedVariants[rounded];
  const sizeClass = sizeVariants[size];

  return (
    <div
      className={cn(
        "relative inline-flex items-center bg-muted/80 shadow-sm",
        sizeClass.container,
        roundedClass,
        className
      )}
    >
      {/* Sliding background indicator */}
      <div
        className={cn(
          "absolute shadow-md transition-all duration-300 ease-in-out",
          activeBgClassName || "bg-primary", // Use custom className or default to bg-primary
          roundedClass // Apply same rounded style to indicator
        )}
        style={{
          top: size === "sm" ? "2px" : size === "md" ? "4px" : "6px",
          bottom: size === "sm" ? "2px" : size === "md" ? "4px" : "6px",
          width: `calc(${100 / modes.length}% - ${
            size === "sm" ? "4px" : size === "md" ? "8px" : "12px"
          })`,
          left: `calc(${activeIndex * (100 / modes.length)}% + ${
            size === "sm" ? "2px" : size === "md" ? "4px" : "6px"
          })`,
        }}
      />

      {/* Mode buttons */}
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => handleToggle(mode.value)}
          className={cn(
            "relative z-10 flex items-center font-medium transition-colors duration-200 justify-center",
            sizeClass.button,
            roundedClass, // Apply rounded style to buttons
            activeMode === mode.value
              ? cn(
                  "text-primary-foreground",
                  activeTextClassName || "text-primary-foreground"
                )
              : cn(
                  "text-muted-foreground hover:text-foreground",
                  inactiveTextClassName ||
                    "text-muted-foreground hover:text-foreground"
                )
          )}
        >
          {mode.icon && (
            <span
              className={cn(
                "transition-transform duration-300",
                sizeClass.icon,
                activeMode === mode.value && "scale-110"
              )}
            >
              {mode.icon}
            </span>
          )}
          {mode.label}
        </button>
      ))}
    </div>
  );
}
