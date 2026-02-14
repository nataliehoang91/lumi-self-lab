"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type SuccessCheckSize = "sm" | "md" | "lg";

export interface SuccessCheckProps {
  /** Size of the icon and circle */
  size?: SuccessCheckSize;
  className?: string;
}

const sizeClasses: Record<SuccessCheckSize, { wrapper: string; icon: string }> = {
  sm: { wrapper: "w-10 h-10", icon: "w-5 h-5" },
  md: { wrapper: "w-16 h-16", icon: "w-8 h-8" },
  lg: { wrapper: "w-20 h-20", icon: "w-10 h-10" },
};

/**
 * Reusable success check icon in a circular badge.
 * Uses a lively, active sage green to convey success/completion.
 */
export function SuccessCheck({ size = "md", className }: SuccessCheckProps) {
  const { wrapper, icon } = sizeClasses[size];
  return (
    <div className={cn("flex justify-center", className)}>
      <div
        className={cn("rounded-full flex items-center justify-center", "bg-success-muted", wrapper)}
      >
        <Check className={cn(icon, "text-success")} />
      </div>
    </div>
  );
}
