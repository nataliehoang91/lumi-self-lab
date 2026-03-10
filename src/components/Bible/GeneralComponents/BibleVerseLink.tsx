"use client";

import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface BibleVerseLinkProps {
  langSegment: "en" | "vi" | "zh";
  /** Translation version for read URL (e.g. "vi", "niv"). EN defaults to "niv" when omitted. */
  version1?: "vi" | "niv" | "kjv" | "zh";
  bookId: string | null;
  chapter: number;
  verse: number;
  /** When set, link targets a range (verse–verseEnd); read page can highlight both. */
  verseEnd?: number;
  testament: "ot" | "nt";
  /** Verse text shown in popover (stored locally, no API). */
  previewText?: string;
  /** Override the "Read Bible" link label. Defaults by lang: vi "Đọc Kinh Thánh", en "Read Bible (NIV)", zh "Read Bible". */
  readLabel?: string;
  /** Optional extra class for the trigger (e.g. smaller text: subBodyClass or "text-sm"). */
  triggerClassName?: string;
  /** When true, render as a direct link (no popover). */
  linkOnly?: boolean;
  children: React.ReactNode;
}

function getFontClass(langSegment: string): string {
  return langSegment === "vi" ? "font-vietnamese" : "font-bible-english";
}

function getDefaultReadLabel(langSegment: string): string {
  switch (langSegment) {
    case "vi":
      return "Đọc Kinh Thánh";
    case "en":
      return "Read Bible (NIV)";
    case "zh":
      return "Read Bible";
    default:
      return "Read Bible";
  }
}

/**
 * Inline verse reference that opens a popover with optional verse preview and a link to read.
 * Shared across the Bible app (Learn, etc.). Uses serif font by locale (Vietnamese / English).
 */
export function BibleVerseLink({
  langSegment,
  version1,
  bookId,
  chapter,
  verse,
  verseEnd,
  testament,
  previewText,
  readLabel,
  triggerClassName,
  linkOnly,
  children,
}: BibleVerseLinkProps) {
  if (!bookId) {
    return <span className="text-muted-foreground/80">{children}</span>;
  }

  const effectiveVersion = version1 ?? (langSegment === "en" ? "niv" : undefined);

  const sp = new URLSearchParams();
  if (effectiveVersion) sp.set("version1", effectiveVersion);
  sp.set("sync", "true");
  sp.set("book1", bookId);
  sp.set("chapter1", String(chapter));
  sp.set("testament1", testament);
  sp.set("verse1", String(verse));
  if (verseEnd != null && verseEnd >= 1 && verseEnd >= verse)
    sp.set("verseEnd", String(verseEnd));

  const href = `/bible/${langSegment}/read?${sp.toString()}`;
  const fontClass = getFontClass(langSegment);
  const label = readLabel ?? getDefaultReadLabel(langSegment);

  const triggerClass =
    `${fontClass} cursor-pointer font-mono text-primary-dark  ` +
    "transition-colors hover:text-primary/90 hover:decoration-primary/90 " +
    "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 rounded " +
    (triggerClassName ?? "");

  if (linkOnly) {
    return (
      <Link href={href} className={triggerClass}>
        {children}
      </Link>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={triggerClass}>
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-w-sm gap-2">
        <p className={`text-muted-foreground ${fontClass} mb-1.5 text-xs font-medium`}>
          {children}
        </p>
        {previewText && (
          <p className={`text-foreground ${fontClass} text-sm leading-relaxed italic`}>
            &ldquo;{previewText}&rdquo;
          </p>
        )}
        <div className="flex justify-end">
          <Link
            href={href}
            className="text-second-600 hover:text-second-800 mt-2 inline-block text-sm
              font-medium underline underline-offset-4"
          >
            {label}
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
