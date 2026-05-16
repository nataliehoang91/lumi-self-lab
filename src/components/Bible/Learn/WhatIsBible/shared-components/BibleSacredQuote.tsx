"use client";

import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { useLocaleFonts } from "@/components/Bible/global/utils";

function LightRays() {
  return (
    <svg width="260" height="90" viewBox="0 0 260 90" fill="none" aria-hidden="true">
      {/* Central source glow */}
      <ellipse cx="130" cy="4" rx="12" ry="6" fill="currentColor" opacity="0.65" />
      {/* Rays fanning out downward */}
      {[
        { x2: 10, y2: 90, op: 0.38, w: 0.85 },
        { x2: 40, y2: 90, op: 0.46, w: 1.05 },
        { x2: 68, y2: 90, op: 0.52, w: 1.15 },
        { x2: 96, y2: 90, op: 0.58, w: 1.35 },
        { x2: 115, y2: 90, op: 0.62, w: 1.55 },
        { x2: 130, y2: 90, op: 0.66, w: 1.75 },
        { x2: 145, y2: 90, op: 0.62, w: 1.55 },
        { x2: 164, y2: 90, op: 0.58, w: 1.35 },
        { x2: 192, y2: 90, op: 0.52, w: 1.15 },
        { x2: 220, y2: 90, op: 0.46, w: 1.05 },
        { x2: 250, y2: 90, op: 0.38, w: 0.85 },
      ].map((ray, i) => (
        <line
          key={i}
          x1="130"
          y1="4"
          x2={ray.x2}
          y2={ray.y2}
          stroke="currentColor"
          strokeWidth={ray.w}
          opacity={ray.op}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function BibleSacredQuote({
  quote,
  reference,
  referenceHref,
  locale,
  className,
}: {
  quote: string;
  reference: string;
  referenceHref?: string;
  locale?: "en" | "vi";
  className?: string;
}) {
  const { mainVerseQuoteClass } = useBibleFontClasses();
  const { titleFont } = useLocaleFonts(locale);
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl px-8 pt-0 pb-10 text-center",
        "border-primary-200/80 dark:border-primary-700/35 border shadow-sm",
        "to-primary/5 bg-linear-to-b from-white via-white",
        "dark:from-background dark:via-background dark:to-primary/10",
        "theme-warm:border-second/35 theme-warm:from-background theme-warm:via-background",
        "theme-warm:to-second/5",
        className
      )}
    >
      {/* Light rays — darker peach-coral */}
      <div
        className="text-coral-600 dark:text-coral-400 pointer-events-none absolute top-0
          left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <LightRays />
      </div>

      {/* Soft bloom — warm peach */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-32 w-64 -translate-x-1/2
          rounded-full blur-3xl"
        style={{ background: "oklch(0.99 0.03 35 / 0.18)" }}
        aria-hidden="true"
      />

      {/* Large decorative open-quote */}
      <div
        className="text-primary-300/50 dark:text-primary-500/30 relative mt-10 mb-0
          font-serif leading-none select-none"
        style={{ fontSize: "5rem", lineHeight: 1 }}
        aria-hidden="true"
      >
        &ldquo;
      </div>

      {/* Quote text */}
      <p
        className={cn(
          "relative z-10 text-xl leading-relaxed font-semibold text-balance",
          "text-foreground dark:text-foreground",
          titleFont,
          mainVerseQuoteClass
        )}
      >
        {quote}
      </p>

      {/* Reference */}
      <div className="relative z-10 mt-6">
        {referenceHref ? (
          <a
            href={referenceHref}
            className={cn(
              `font-mono text-sm tracking-widest underline underline-offset-4
                transition-colors`,
              "text-primary-600 hover:text-primary-700",
              "dark:text-primary-400 dark:hover:text-primary-300",
              bodyFont
            )}
          >
            {reference}
          </a>
        ) : (
          <p
            className={cn(
              "text-primary-800 dark:text-primary-400 font-mono text-sm tracking-widest",
              bodyFont
            )}
          >
            {reference}
          </p>
        )}
      </div>
    </div>
  );
}
