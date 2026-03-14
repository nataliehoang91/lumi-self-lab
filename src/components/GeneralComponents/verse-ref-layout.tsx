"use client";

import { type ReactNode, useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import type { KeyVerseRow } from "@/app/actions/bible/book-overview";
import { BibleVerseLink } from "@/components/Bible/GeneralComponents/BibleVerseLink";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// Shared types
// -----------------------------------------------------------------------------

export interface VerseRefItem {
  text: string;
  reference: string;
}

export interface OutlineItem {
  title: string;
  chapters: string;
}

/** Default gradient classes per "book" for ColorAccentLayout. */
export const DEFAULT_BOOK_COLORS = [
  "from-purple-500/20 to-purple-600/10",
  "from-blue-500/20 to-blue-600/10",
  "from-green-500/20 to-green-600/10",
  "from-amber-500/20 to-amber-600/10",
] as const;

// -----------------------------------------------------------------------------
// 1. Grid / 2-column layout
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
// 2. Quotation mark visual accent
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
// 3. Reference tag system
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
// 4. Expandable sections (for outlines)
// -----------------------------------------------------------------------------

export interface ExpandableOutlineLayoutProps {
  outlines: OutlineItem[];
  /** Initial expanded index (default 0). Pass null for none. */
  defaultExpandedIndex?: number | null;
  /** Optional content when a section is expanded. */
  renderExpandContent?: (outline: OutlineItem, index: number) => ReactNode;
  /** Optional "Read in Bible" (or similar) action per outline. */
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
// 5. Minimal dividers + spacing
// -----------------------------------------------------------------------------

export interface MinimalDividersVerseLayoutProps {
  verses: VerseRefItem[];
  /** Optional link or button per verse (e.g. to open in Bible). */
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
// 6. Color accent system
// -----------------------------------------------------------------------------

export interface ColorAccentVerseLayoutProps {
  verses: VerseRefItem[];
  /** Gradient classes to cycle (e.g. DEFAULT_BOOK_COLORS). */
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
// 7. Hybrid – compact cards with accent (recommended)
// -----------------------------------------------------------------------------

export interface HybridVerseLayoutProps {
  verses: VerseRefItem[];
  renderAction?: (verse: VerseRefItem, index: number) => ReactNode;
  className?: string;
  cardClassName?: string;
}

export function HybridVerseLayout({
  verses,
  renderAction,
  className,
  cardClassName,
}: HybridVerseLayoutProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 md:grid-cols-2", className)}>
      {verses.map((verse, idx) => (
        <div
          key={idx}
          className={cn(
            `border-primary/20 from-primary/5 hover:border-primary/40 group rounded-lg
            border bg-gradient-to-br via-transparent to-transparent p-4 transition-all
            hover:shadow-md`,
            cardClassName
          )}
        >
          <div className="flex gap-3">
            <div
              className="from-primary to-primary/30 w-1 shrink-0 rounded-full
                bg-gradient-to-b"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p
                className="text-foreground group-hover:text-primary mb-2 text-sm
                  leading-relaxed italic transition-colors"
              >
                {verse.text}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-primary text-xs font-medium">
                  {verse.reference}
                </span>
                {renderAction?.(verse, idx) ?? null}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Key verses section (shared for book overview & verse layouts)
// -----------------------------------------------------------------------------

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

export interface KeyVersesSectionProps {
  keyVerses: KeyVerseRow[];
  displayName: string;
  langSegment: "en" | "vi";
  defaultVersion: "vi" | "niv" | undefined;
  bookId: string;
  testament: "ot" | "nt";
  /** "cards" = current book overview style; "hybrid" = HybridVerseLayout. */
  layout?: "cards" | "hybrid";
  /** Section heading. Defaults to "Key Verses" / "Các câu Kinh Thánh trọng tâm". */
  sectionTitle?: string;
  className?: string;
}

export function KeyVersesSection({
  keyVerses,
  displayName,
  langSegment,
  defaultVersion,
  bookId,
  testament,
  layout = "hybrid",
  sectionTitle,
  className,
}: KeyVersesSectionProps) {
  const isVi = langSegment === "vi";
  const {
    bodyClass,
    bodyClassUp,
    subBodyClass,
    subtitleClass,
  } = useBibleFontClasses();

  const title =
    sectionTitle ??
    (langSegment === "vi" ? "Các câu Kinh Thánh trọng tâm" : "Key Verses");

  const renderReference = (v: KeyVerseRow) => {
    const label = `${displayName} ${v.ref}`;
    const loc = getKeyVerseLocation(v);
    const badgeClass = cn(
      "inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium",
      layout === "hybrid" ? "text-xs" : subBodyClass,
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
          "inline-flex items-center gap-1 self-end rounded-full bg-primary-100 px-2 py-1 font-medium text-slate-900 hover:text-primary/90 dark:bg-primary-900/30 dark:text-primary-400",
          layout === "hybrid" ? bodyClass : subBodyClass,
          isVi && "font-vietnamese-flashcard"
        )}
      >
        <BookOpen className="h-3 w-3" />
        {label}
      </BibleVerseLink>
    );
  };

  if (layout === "hybrid") {
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
          renderAction={(_, idx) => {
            const v = keyVerses[idx];
            if (!v) return null;
            const loc = getKeyVerseLocation(v);
            if (!loc) return null;
            return (
              <BibleVerseLink
                langSegment={langSegment}
                version1={defaultVersion}
                bookId={bookId}
                chapter={loc.chapter}
                verse={loc.verse}
                testament={testament}
                linkOnly
                triggerClassName="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                →
              </BibleVerseLink>
            );
          }}
        />
      </section>
    );
  }

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
            className="border-border/50 bg-card rounded-lg border p-4 transition-shadow hover:shadow-md"
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
