"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

export interface LearnWhatIsBibleAuthorsSectionProps {
  title: string;
  intro: ReactNode;
  bulletItems: ReactNode[];
  conclusion: ReactNode;
  quoteBlocks: ReactNode[];
  /** Optional block after the conclusion and before the quote (e.g. timeline image). */
  beforeQuote?: ReactNode;
  /** Override classes on the quote wrapper div (e.g. to remove background). */
  quoteContainerClassName?: string;
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
}

export function LearnWhatIsBibleAuthorsSection({
  title,
  intro,
  bulletItems,
  conclusion,
  quoteBlocks,
  beforeQuote,
  quoteContainerClassName,
  locale,
}: LearnWhatIsBibleAuthorsSectionProps) {
  const { bodyClassUp } = useBibleFontClasses();
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";

  return (
    <section className="mt-12">
      <h3
        className={cn("mb-4 text-xl font-semibold", titleFont)}
      >
        {title}
      </h3>

      {typeof intro === "string" ? (
        <p className={cn("leading-relaxed", bodyClassUp, bodyFont)}>{intro}</p>
      ) : (
        intro
      )}

      <ul className="mt-4 space-y-2">
        {bulletItems.map((item, idx) => (
          <li
            key={idx}
            className={cn(
              "space-y-4 leading-relaxed md:space-y-0",
              bodyClassUp,
              bodyFont
            )}
          >
            {item}
          </li>
        ))}
      </ul>

      {typeof conclusion === "string" ? (
        <p
          className={cn("mt-4 leading-relaxed", bodyClassUp, bodyFont)}
        >
          {conclusion}
        </p>
      ) : (
        conclusion
      )}

      {beforeQuote}

      <div
        className={cn(
          quoteContainerClassName ??
            "bg-primary-light/10 border-primary-dark/30 mt-6 flex flex-col items-center justify-center gap-4 space-y-4 rounded-xl border p-6"
        )}
      >
        {quoteBlocks.map((block, idx) => (
          <div key={idx}>{block}</div>
        ))}
      </div>
    </section>
  );
}
