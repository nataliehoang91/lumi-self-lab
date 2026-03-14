"use client";

import { type ReactNode, useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import type { KeyVerseRow } from "@/app/actions/bible/book-overview";
import { BibleVerseLink } from "@/components/Bible/GeneralComponents/BibleVerseLink";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// Types & utils
// -----------------------------------------------------------------------------

export interface VerseRefItem {
  text: string;
  reference: string;
}

export interface OutlineItem {
  title: string;
  chapters: string;
}

export const DEFAULT_BOOK_COLORS = [
  "from-purple-500/20 to-purple-600/10",
  "from-blue-500/20 to-blue-600/10",
  "from-green-500/20 to-green-600/10",
  "from-amber-500/20 to-amber-600/10",
] as const;

export function getKeyVerseLocation(
  v: KeyVerseRow
): { chapter: number; verse: number } | null {
  if (v.chapter != null && v.verse != null) {
    return { chapter: v.chapter, verse: v.verse };
  }
  const match = v.ref.match(/(\d+):(\d+)/);
  if (!match) return null;
  const chapterNum = Number.parseInt(match[1], 10);
  const verseNum = Number.parseInt(match[2], 10);
  if (!Number.isFinite(chapterNum) || !Number.isFinite(verseNum)) return null;
  return { chapter: chapterNum, verse: verseNum };
}

// -----------------------------------------------------------------------------
// 1. Grid
// -----------------------------------------------------------------------------

export interface GridVerseLayoutProps {
  verses: VerseRefItem[];
  className?: string;
  cardClassName?: string;
}

export function GridVerseLayout({
  verses,
  className,
  cardClassName,
}: GridVerseLayoutProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", className)}>
      {verses.map((verse, idx) => (
        <div
          key={idx}
          className={cn(
            `border-border/50 bg-card hover:border-border rounded-lg border p-4
            transition-colors`,
            cardClassName
          )}
        >
          <p className="text-foreground mb-2 text-sm italic">{verse.text}</p>
          <p className="text-muted-foreground text-xs">{verse.reference}</p>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 2. Quotation accent
// -----------------------------------------------------------------------------

export interface QuotationAccentVerseLayoutProps {
  verses: VerseRefItem[];
  className?: string;
  cardClassName?: string;
}

export function QuotationAccentVerseLayout({
  verses,
  className,
  cardClassName,
}: QuotationAccentVerseLayoutProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {verses.map((verse, idx) => (
        <div
          key={idx}
          className={cn(
            `border-border/30 from-primary/5 flex gap-3 rounded-lg border bg-gradient-to-r
            to-transparent p-4`,
            cardClassName
          )}
        >
          <span className="text-primary/20 shrink-0 text-4xl leading-none" aria-hidden>
            &ldquo;
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-foreground text-sm italic">{verse.text}</p>
            <p className="text-primary mt-1.5 text-xs">{verse.reference}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 3. Reference tag
// -----------------------------------------------------------------------------

export interface ReferenceTagVerseLayoutProps {
  verses: VerseRefItem[];
  className?: string;
  cardClassName?: string;
}

export function ReferenceTagVerseLayout({
  verses,
  className,
  cardClassName,
}: ReferenceTagVerseLayoutProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {verses.map((verse, idx) => (
        <div
          key={idx}
          className={cn(
            `border-border/50 bg-card rounded-lg border p-4 transition-shadow
            hover:shadow-md`,
            cardClassName
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-foreground min-w-0 flex-1 text-sm italic">{verse.text}</p>
            <span
              className="bg-primary/10 text-primary inline-flex shrink-0 items-center
                gap-1 rounded-full px-2 py-1 text-xs font-medium"
              aria-hidden
            >
              <BookOpen className="h-3 w-3" />
              {verse.reference}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 4. Expandable outline
// -----------------------------------------------------------------------------

export interface ExpandableOutlineLayoutProps {
  outlines: OutlineItem[];
  defaultExpandedIndex?: number | null;
  renderExpandContent?: (outline: OutlineItem, index: number) => ReactNode;
  renderReadAction?: (outline: OutlineItem, index: number) => ReactNode;
  className?: string;
}

export function ExpandableOutlineLayout({
  outlines,
  defaultExpandedIndex = 0,
  renderExpandContent,
  renderReadAction,
  className,
}: ExpandableOutlineLayoutProps) {
  const [expanded, setExpanded] = useState<number | null>(defaultExpandedIndex ?? null);

  return (
    <div className={cn("space-y-2", className)}>
      {outlines.map((outline, idx) => (
        <div key={idx}>
          <button
            type="button"
            onClick={() => setExpanded(expanded === idx ? null : idx)}
            className="border-border/50 bg-card hover:bg-muted/50 flex w-full items-center
              justify-between rounded-lg border px-4 py-3 text-left transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-foreground font-medium">{outline.title}</p>
              <p className="text-muted-foreground text-xs">{outline.chapters}</p>
            </div>
            <ChevronDown
              className={cn(
                "text-muted-foreground h-4 w-4 shrink-0 transition-transform",
                expanded === idx && "rotate-180"
              )}
              aria-hidden
            />
          </button>
          {expanded === idx && (
            <div className="border-primary/30 mt-2 ml-4 space-y-2 border-l pb-2 pl-3">
              {renderExpandContent?.(outline, idx)}
              {renderReadAction?.(outline, idx)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 5. Minimal dividers
// -----------------------------------------------------------------------------

export interface MinimalDividersVerseLayoutProps {
  verses: VerseRefItem[];
  renderAction?: (verse: VerseRefItem, index: number) => ReactNode;
  className?: string;
}

export function MinimalDividersVerseLayout({
  verses,
  renderAction,
  className,
}: MinimalDividersVerseLayoutProps) {
  return (
    <div className={className}>
      {verses.map((verse, idx) => (
        <div
          key={idx}
          className={cn(
            "border-primary border-l-2 py-5 pl-4",
            idx !== verses.length - 1 && "border-border/30 border-b"
          )}
        >
          <p className="text-foreground mb-3 text-sm italic">{verse.text}</p>
          {renderAction ? (
            renderAction(verse, idx)
          ) : (
            <span className="text-primary text-xs font-medium">{verse.reference}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 6. Color accent
// -----------------------------------------------------------------------------

export interface ColorAccentVerseLayoutProps {
  verses: VerseRefItem[];
  colorGradients?: readonly string[];
  className?: string;
  cardClassName?: string;
}

export function ColorAccentVerseLayout({
  verses,
  colorGradients = DEFAULT_BOOK_COLORS,
  className,
  cardClassName,
}: ColorAccentVerseLayoutProps) {
  const colors = [...colorGradients];

  return (
    <div className={cn("space-y-3", className)}>
      {verses.map((verse, idx) => (
        <div
          key={idx}
          className={cn(
            "border-border/30 rounded-lg border bg-gradient-to-r p-4",
            colors[idx % colors.length],
            cardClassName
          )}
        >
          <p className="text-foreground mb-2 text-sm italic">{verse.text}</p>
          <p className="text-muted-foreground text-xs font-medium">{verse.reference}</p>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 7. Hybrid
// -----------------------------------------------------------------------------

export interface HybridVerseLayoutProps {
  verses: VerseRefItem[];
  renderReference?: (verse: VerseRefItem, index: number) => ReactNode;
  className?: string;
  cardClassName?: string;
}

export function HybridVerseLayout({
  verses,
  renderReference,
  className,
  cardClassName,
}: HybridVerseLayoutProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 md:grid-cols-2", className)}>
      {verses.map((verse, idx) => (
        <div
          key={idx}
          className={cn(
            `border-primary/20 from-primary/5 hover:border-primary/40 group
            via-primary/[0.07] rounded-lg border bg-gradient-to-br to-transparent p-4
            transition-all hover:shadow-md`,
            cardClassName
          )}
        >
          <div className="flex gap-3">
            <div
              className="from-primary via-primary/60 to-primary/20 w-1 shrink-0
                rounded-full bg-gradient-to-b"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p
                className="text-foreground group-hover:text-primary mb-2 text-sm
                  leading-relaxed italic transition-colors"
              >
                {verse.text}
              </p>
              <div className="flex items-center">
                {renderReference ? (
                  renderReference(verse, idx)
                ) : (
                  <span className="text-primary text-xs font-medium">
                    {verse.reference}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Key verses: Hybrid
// -----------------------------------------------------------------------------

export interface KeyVersesSectionHybridProps {
  keyVerses: KeyVerseRow[];
  displayName: string;
  langSegment: "en" | "vi";
  defaultVersion: "vi" | "niv" | undefined;
  bookId: string;
  testament: "ot" | "nt";
  sectionTitle?: string;
  className?: string;
}

export function KeyVersesSectionHybrid({
  keyVerses,
  displayName,
  langSegment,
  defaultVersion,
  bookId,
  testament,
  sectionTitle,
  className,
}: KeyVersesSectionHybridProps) {
  const isVi = langSegment === "vi";
  const { bodyClass, subtitleClass } = useBibleFontClasses();

  const title =
    sectionTitle ??
    (langSegment === "vi" ? "Các câu Kinh Thánh trọng tâm" : "Key Verses");

  const verses: VerseRefItem[] = keyVerses.map((v) => ({
    text: `"${v.text}"`,
    reference: `${displayName} ${v.ref}`,
  }));

  return (
    <section className={cn("mb-10", className)}>
      <h2
        className={cn(
          "text-foreground mb-4 font-serif font-semibold",
          subtitleClass,
          isVi && "font-vietnamese-flashcard"
        )}
      >
        {title}
      </h2>
      <HybridVerseLayout
        verses={verses}
        renderReference={(_, idx) => {
          const v = keyVerses[idx];
          if (!v) return null;
          const label = `${displayName} ${v.ref}`;
          const loc = getKeyVerseLocation(v);
          if (!loc) {
            return (
              <span
                className="text-primary-900 ml-auto text-xs font-medium underline
                  underline-offset-2"
              >
                {label}
              </span>
            );
          }
          return (
            <BibleVerseLink
              langSegment={langSegment}
              version1={defaultVersion}
              bookId={bookId}
              chapter={loc.chapter}
              verse={loc.verse}
              testament={testament}
              linkOnly
              triggerClassName={cn(
                "text-primary-900! hover:text-primary-700 ml-auto text-xs font-medium underline underline-offset-2 transition-colors",
                bodyClass,
                isVi && "font-vietnamese-flashcard"
              )}
            >
              {label}
            </BibleVerseLink>
          );
        }}
      />
    </section>
  );
}

// -----------------------------------------------------------------------------
// Key verses: Cards
// -----------------------------------------------------------------------------

export interface KeyVersesSectionCardsProps {
  keyVerses: KeyVerseRow[];
  displayName: string;
  langSegment: "en" | "vi";
  defaultVersion: "vi" | "niv" | undefined;
  bookId: string;
  testament: "ot" | "nt";
  sectionTitle?: string;
  className?: string;
}

export function KeyVersesSectionCards({
  keyVerses,
  displayName,
  langSegment,
  defaultVersion,
  bookId,
  testament,
  sectionTitle,
  className,
}: KeyVersesSectionCardsProps) {
  const isVi = langSegment === "vi";
  const { bodyClassUp, subBodyClass, subtitleClass } = useBibleFontClasses();

  const title =
    sectionTitle ??
    (langSegment === "vi" ? "Các câu Kinh Thánh trọng tâm" : "Key Verses");

  const renderReference = (v: KeyVerseRow) => {
    const label = `${displayName} ${v.ref}`;
    const loc = getKeyVerseLocation(v);
    const badgeClass = cn(
      "inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium",
      subBodyClass,
      isVi && "font-vietnamese-flashcard"
    );
    if (!loc) {
      return (
        <span className={cn("bg-primary/10 text-primary", badgeClass)}>
          <BookOpen className="h-3 w-3" />
          {label}
        </span>
      );
    }
    return (
      <BibleVerseLink
        langSegment={langSegment}
        version1={defaultVersion}
        bookId={bookId}
        chapter={loc.chapter}
        verse={loc.verse}
        testament={testament}
        linkOnly
        triggerClassName={cn(
          "theme-warm:text-second theme-warm:dark:text-white inline-flex items-center gap-1 self-end rounded-full bg-primary-100 px-2 py-1 font-medium text-slate-900 hover:text-primary/90 dark:bg-primary-900/30 dark:text-primary-400",
          subBodyClass,
          isVi && "font-vietnamese-flashcard"
        )}
      >
        <BookOpen className="h-3 w-3" />
        {label}
      </BibleVerseLink>
    );
  };

  return (
    <section className={cn("mb-10", className)}>
      <h2
        className={cn(
          "text-foreground mb-4 font-serif font-semibold",
          subtitleClass,
          isVi && "font-vietnamese-flashcard"
        )}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {keyVerses.map((v) => (
          <div
            key={v.ref}
            className="border-border/50 bg-card rounded-lg border p-4 transition-shadow
              hover:shadow-md"
          >
            <div className="mb-2 flex flex-col gap-3">
              <p
                className={cn(
                  "text-foreground italic",
                  bodyClassUp,
                  isVi && "font-vietnamese-flashcard"
                )}
              >
                &quot;{v.text}&quot;
              </p>
              {renderReference(v)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
