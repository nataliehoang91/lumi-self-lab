import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PrettyIconVariant = "primary" | "secondary" | "tertiary" | "logo";
export type PrettyIconSize = "sm" | "md" | "lg";

interface PrettyIconProps {
  children: ReactNode;
  variant?: PrettyIconVariant;
  size?: PrettyIconSize;
  className?: string;
}

const sizeClasses: Record<PrettyIconSize, string> = {
  sm: "w-10 h-10 rounded-lg",
  md: "w-12 h-12 rounded-xl",
  lg: "w-20 h-20 md:w-24 md:h-24 rounded-3xl",
};

const variantClasses: Record<PrettyIconVariant, string> = {
  primary:
    "bg-primary/25 flex items-center justify-center [&>svg]:shrink-0 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-primary",
  secondary:
    "bg-second/25 flex items-center justify-center [&>svg]:shrink-0 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-second",
  tertiary:
    "bg-tertiary/30 flex items-center justify-center [&>svg]:shrink-0 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-tertiary",
  logo: "bg-gradient-to-br from-primary/20 to-second/20 flex items-center justify-center ring-1 ring-primary/30 [&>svg]:shrink-0 [&>svg]:w-10 [&>svg]:h-10 md:[&>svg]:w-12 md:[&>svg]:h-12 [&>svg]:text-primary",
};

/**
 * SelfWithin pretty icon wrapper. Renders a rounded container with the icon (as children).
 * Use for logo, feature icons, or any branded icon treatment.
 */
export function PrettyIcon({
  children,
  variant = "primary",
  size = "sm",
  className,
}: PrettyIconProps) {
  return (
    <div className={cn(sizeClasses[size], variantClasses[variant], className)}>{children}</div>
  );
}
