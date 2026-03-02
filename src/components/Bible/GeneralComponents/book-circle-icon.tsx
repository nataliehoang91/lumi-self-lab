"use client";

import { BookOpenIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type BookCircleIconSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<BookCircleIconSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

interface BookCircleIconProps {
  size?: BookCircleIconSize;
  className?: string;
}

export function BookCircleIcon({ size = "md", className }: BookCircleIconProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center border-primary/30 dark:border-primary-light/20 rounded-full border shadow-sm",
        SIZE_CLASSES[size],
        className
      )}
    >
      <BookOpenIcon className="h-5 w-5 text-primary" aria-hidden />
    </div>
  );
}
