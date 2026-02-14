"use client";

import { RefreshCw, LucideIcon, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FallbackProps } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { Container } from "./ui/container";
import { Card } from "./ui/card";

interface GeneralErrorFallbackProps extends FallbackProps {
  icon?: LucideIcon;
  defaultDescription?: string;
  showHomeButton?: boolean;
  homeUrl?: string;
}

export function GeneralErrorFallback({
  error,
  resetErrorBoundary,
  icon: Icon,
  defaultDescription = "An unexpected error occurred.",
  showHomeButton = true,
  homeUrl = "/dashboard",
}: GeneralErrorFallbackProps) {
  const router = useRouter();

  const getErrorType = () => {
    if (
      error.message?.includes("fetch") ||
      error.message?.includes("network") ||
      error.message?.includes("500") ||
      error.message?.includes("502") ||
      error.message?.includes("503") ||
      error.message?.includes("504")
    ) {
      return {
        title: "Connection Error",
        description: "Unable to load data. Please check your internet connection and try again.",
      };
    }
    if (error.message?.includes("404") || error.message?.includes("not found")) {
      return {
        title: "Data Not Found",
        description: "The requested data could not be found.",
      };
    }
    if (error.message?.includes("401") || error.message?.includes("unauthorized")) {
      return {
        title: "Authentication Required",
        description: "You need to log in to access this data.",
      };
    }
    if (
      error.message?.includes("Prisma") ||
      error.message?.includes("database") ||
      error.message?.includes("DATABASE_URL") ||
      error.message?.includes("Cannot store chat data")
    ) {
      return {
        title: "Database Connection Error",
        description:
          "Unable to connect to the database. Please check your connection and try again.",
      };
    }
    return {
      title: "Something went wrong",
      description: defaultDescription,
    };
  };

  const { title, description } = getErrorType();

  return (
    <Container maxWidth="md" className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md text-center p-6 border-none shadow-none">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 flex items-center justify-center rounded-full bg-red-50 border border-red-400 shadow-sm">
            {Icon ? (
              <Icon className="h-9 w-9 text-coral" />
            ) : (
              <RefreshCw className="h-9 w-9 text-coral" />
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground mb-6">{description}</p>

        {process.env.NODE_ENV === "development" && (
          <details className="text-left mb-6 rounded-lg border border-border bg-muted/50 p-3">
            <summary className="text-sm font-medium text-muted-foreground cursor-pointer">
              Technical details
            </summary>
            <p className="mt-2 text-xs text-destructive font-mono break-words">{error.message}</p>
          </details>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center">
          {showHomeButton && (
            <Button variant="outline" onClick={() => router.push(homeUrl)}>
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          )}
          <Button variant="secondaryLight" onClick={resetErrorBoundary}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </Card>
    </Container>
  );
}
