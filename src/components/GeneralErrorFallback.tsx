"use client";

import { RefreshCw, LucideIcon, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FallbackProps } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    // Check error message or type to determine what kind of error
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
        description:
          "Unable to load data. Please check your internet connection and try again.",
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-100 dark:bg-gray-900/20",
      };
    }

    if (
      error.message?.includes("404") ||
      error.message?.includes("not found")
    ) {
      return {
        title: "Data Not Found",
        description: "The requested data could not be found.",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/20",
      };
    }

    if (
      error.message?.includes("401") ||
      error.message?.includes("unauthorized")
    ) {
      return {
        title: "Authentication Required",
        description: "You need to log in to access this data.",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/20",
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
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-100 dark:bg-orange-900/20",
      };
    }

    // Default error
    return {
      title: "Something went wrong",
      description: defaultDescription,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    };
  };

  const { title, description } = getErrorType();

  return (
    <div className="flex items-center justify-center p-4 min-h-[400px]">
      <Card className="w-full max-w-lg border-none shadow-none bg-transparent">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {Icon ? (
              <div className="h-48 w-48 flex items-center justify-center bg-muted rounded-full">
                <Icon className="h-24 w-24 text-muted-foreground" />
              </div>
            ) : (
              <div className="h-48 w-48 flex items-center justify-center bg-muted rounded-full">
                <RefreshCw className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-sm text-red-800 dark:text-red-200 font-mono break-words">
                {error.message}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-row gap-3 px-4 py-2">
          <Button onClick={resetErrorBoundary} className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          {showHomeButton && (
            <Button
              variant="outline"
              onClick={() => router.push(homeUrl)}
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
