"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

export type OccupationIconKey =
  | "crown"
  | "shepherd"
  | "scroll"
  | "cross"
  | "fish"
  | "coins";

const ICONS: Record<OccupationIconKey, ReactNode> = {
  crown: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <path
        d="M7 33 L11 16 L18 24 L22 10 L26 24 L33 16 L37 33 Z"
        fill="currentColor"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line
        x1="7"
        y1="33"
        x2="37"
        y2="33"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="11" cy="15" r="2.5" fill="currentColor" />
      <circle cx="22" cy="9" r="2.5" fill="currentColor" />
      <circle cx="33" cy="15" r="2.5" fill="currentColor" />
    </svg>
  ),
  shepherd: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <path
        d="M28 38 V 22 Q 28 11 20 11 Q 11 11 11 19 Q 11 25 18 25"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx="24"
        cy="32"
        rx="5"
        ry="3.5"
        fill="currentColor"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="30" cy="34" r="1.5" fill="currentColor" />
    </svg>
  ),
  scroll: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <rect
        x="10"
        y="12"
        width="24"
        height="20"
        rx="2"
        fill="currentColor"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <ellipse
        cx="10"
        cy="18"
        rx="3"
        ry="6"
        fill="currentColor"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <ellipse
        cx="34"
        cy="18"
        rx="3"
        ry="6"
        fill="currentColor"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M14 20h16M14 25h12M14 30h9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  cross: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <rect
        x="18"
        y="7"
        width="8"
        height="30"
        rx="3"
        fill="currentColor"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="7"
        y="18"
        width="30"
        height="8"
        rx="3"
        fill="currentColor"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  fish: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <path
        d="M9 22 Q20 10 31 22 Q20 34 9 22 Z"
        fill="currentColor"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M31 22 L40 15 L40 29 Z"
        fill="currentColor"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="19" r="2.5" fill="currentColor" />
    </svg>
  ),
  coins: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <path
        d="M11 30 V 26"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M33 30 V 26"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse
        cx="22"
        cy="30"
        rx="11"
        ry="4"
        fill="currentColor"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M11 26 V 22"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M33 26 V 22"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse
        cx="22"
        cy="26"
        rx="11"
        ry="4"
        fill="currentColor"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <ellipse
        cx="22"
        cy="22"
        rx="11"
        ry="4"
        fill="currentColor"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
};

export interface OccupationCardData {
  icon: OccupationIconKey;
  role: string;
  person: string;
  verseLink: ReactNode;
}

export function AuthorOccupationGrid({
  cards,
  locale,
}: {
  cards: OccupationCardData[];
  locale?: "en" | "vi";
}) {
  const { bodyClassUp, bodyClass } = useBibleFontClasses();
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={cn(
            "flex flex-col items-center gap-3 rounded-xl border border-second-200",
            "bg-card px-4 py-6 text-center dark:border-second/30"
          )}
        >
          <div className="text-second-700 theme-warm:text-primary mb-1">
            {ICONS[card.icon]}
          </div>
          <p
            className={cn(
              "font-semibold leading-snug text-foreground",
              bodyClassUp,
              bodyFont
            )}
          >
            {card.role}
          </p>
          <p className={cn("text-foreground/60", bodyClass, bodyFont)}>{card.person}</p>
          <div className={cn("mt-auto pt-1 text-second-dark", bodyClass, bodyFont)}>
            {card.verseLink}
          </div>
        </div>
      ))}
    </div>
  );
}
