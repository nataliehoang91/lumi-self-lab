"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface GlossaryGridItem {
  term: string | ReactNode;
  def: string | ReactNode;
  icon: LucideIcon;
}

export interface LearnWhatIsBibleGlossaryGridProps {
  glossaryTitle: string;
  /** Short line under the title (e.g. UI experiment note). */
  glossaryLead?: string;
  items: readonly GlossaryGridItem[];
  locale?: "en" | "vi";
}

export function LearnWhatIsBibleGlossaryGrid({
  glossaryTitle,
  glossaryLead,
  items,
  locale,
}: LearnWhatIsBibleGlossaryGridProps) {
  const { bodyClassUp } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <section className="mb-14">
      <h2
        className={cn("text-foreground mb-2 font-semibold", titleFont, bodyClassUp)}
      >
        {glossaryTitle}
      </h2>
      {glossaryLead && (
        <p
          className={cn(
            "text-muted-foreground mb-5 text-sm leading-relaxed",
            bodyClassUp,
            bodyFont
          )}
        >
          {glossaryLead}
        </p>
      )}
      <ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        role="list"
      >
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <li key={i}>
              <article
                className={cn(
                  "border-border/70 bg-background/80 flex h-full gap-3 rounded-xl border p-4 shadow-sm",
                  "theme-warm:border-border/50"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    "bg-primary/15 text-primary-700 dark:bg-primary/20 dark:text-primary"
                  )}
                  aria-hidden
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      "text-foreground mb-1.5 text-base font-semibold leading-snug",
                      bodyClassUp,
                      bodyFont
                    )}
                  >
                    {item.term}
                  </h3>
                  <p
                    className={cn(
                      "text-foreground/85 text-sm leading-relaxed",
                      bodyClassUp,
                      bodyFont
                    )}
                  >
                    {item.def}
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
