"use client";

import type { ReactNode } from "react";

export interface LearnVerseBulletItemProps {
  /** Text after the bullet (e.g. "Khóc vì đau buồn"). */
  label: ReactNode;
  /** Verse link or other reference node after the dash. */
  reference: ReactNode;
}

/**
 * List row: "• {label} - {reference}" for lesson bullet + BibleVerseLink patterns.
 */
export function LearnVerseBulletItem({ label, reference }: LearnVerseBulletItemProps) {
  return (
    <li>
      • {label}
      <span className="px-1">-</span>
      {reference}
    </li>
  );
}
