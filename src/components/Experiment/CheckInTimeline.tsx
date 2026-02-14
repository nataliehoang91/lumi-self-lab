"use client";

import { Check } from "lucide-react";

export type CheckInForTimeline = {
  id: string;
  checkInDate: string;
};

interface CheckInTimelineProps {
  checkIns: CheckInForTimeline[];
  onSelectDate: (date: string) => void;
}

/**
 * Phase C.2: List of check-in dates (DESC). Clicking an item calls onSelectDate with YYYY-MM-DD.
 */
export function CheckInTimeline({ checkIns, onSelectDate }: CheckInTimelineProps) {
  const sorted = [...checkIns].sort(
    (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
  );

  if (sorted.length === 0) return null;

  return (
    <ul className="space-y-1">
      {sorted.map((checkIn) => (
        <li key={checkIn.id}>
          <button
            type="button"
            onClick={() => onSelectDate(checkIn.checkInDate)}
            className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted/60 transition-colors"
          >
            <span className="text-muted-foreground font-mono">{checkIn.checkInDate}</span>
            <span className="flex items-center gap-1.5 text-foreground">
              <Check className="w-4 h-4 text-emerald-500" />
              Checked in
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
