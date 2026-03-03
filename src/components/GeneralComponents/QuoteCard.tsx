"use client";

import { cn } from "@/lib/utils";
import { QuoteIcon } from "lucide-react";

export interface QuoteCardProps {
  /** Main quote text, including any quotation marks you want rendered. */
  quote: string;
  /** Small label on the bottom right, e.g. reference or author. */
  footnote?: string;
  className?: string;
}

export function QuoteCard({ quote, footnote, className }: QuoteCardProps) {
  return (
    <div
      className={cn(
        "bg-primary-light/5 border-primary relative rounded-xl border px-5 py-4",
        className
      )}
    >
      <span
        className="text-primary absolute top-3 left-4 text-3xl leading-none select-none"
        aria-hidden="true"
      >
        <QuoteIcon className="h-6 w-6" aria-hidden="true" />
      </span>
      <p
        className="font-bible-english md:text-md pt-4 pl-8 text-lg leading-relaxed
          font-semibold"
      >
        {quote}
      </p>
      {footnote && (
        <p className="text-muted-foreground mt-3 text-right font-mono text-sm">
          {footnote}
        </p>
      )}
    </div>
  );
}
