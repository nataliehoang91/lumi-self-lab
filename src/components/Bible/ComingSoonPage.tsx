"use client";

import { BookOpen } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
    >
      <div
        className="bg-primary/10 mb-6 flex h-16 w-16 items-center justify-center
          rounded-2xl"
      >
        <BookOpen className="text-primary h-8 w-8" />
      </div>
      <h1 className="text-foreground mb-2 text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        {description ?? "This feature is coming soon. Check back later."}
      </p>
      <p className="text-muted-foreground/80 mt-4 text-xs">Coming soon</p>
    </div>
  );
}
