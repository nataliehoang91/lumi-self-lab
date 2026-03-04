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
    <div className={cn("mx-auto min-h-screen w-full max-w-7xl py-6 md:px-4", className)}>
      {children}
    </div>
  );
}
