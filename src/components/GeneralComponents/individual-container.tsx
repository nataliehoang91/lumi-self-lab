import { cn } from "@/lib/utils";

interface IndividualContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Consistent container for individual portal pages: min-h-screen, 7xl, md:px-4, py-6.
 */
export function IndividualContainer({ children, className }: IndividualContainerProps) {
  return (
    <div className={cn("min-h-screen w-full mx-auto max-w-7xl md:px-4 py-6", className)}>
      {children}
    </div>
  );
}
