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
}

export function LearnWhatIsBibleAuthorsSection({
  title,
  intro,
  bulletItems,
  conclusion,
  quoteBlocks,
}: LearnWhatIsBibleAuthorsSectionProps) {
  const { bodyClass } = useBibleFontClasses();

  return (
    <section className="mt-12">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>

      {typeof intro === "string" ? (
        <p className={cn("leading-relaxed", bodyClass)}>{intro}</p>
      ) : (
        intro
      )}

      <ul className="mt-4 space-y-2">
        {bulletItems.map((item, idx) => (
          <li
            key={idx}
            className={cn("space-y-4 leading-relaxed md:space-y-0", bodyClass)}
          >
            {item}
          </li>
        ))}
      </ul>

      {typeof conclusion === "string" ? (
        <p className={cn("mt-4 leading-relaxed", bodyClass)}>{conclusion}</p>
      ) : (
        conclusion
      )}

      <div
        className="bg-primary-light/10 border-primary-dark/30 mt-6 flex flex-col
          items-center justify-center gap-4 space-y-4 rounded-xl border p-6"
      >
        {quoteBlocks.map((block, idx) => (
          <div key={idx}>{block}</div>
        ))}
      </div>
    </section>
  );
}
