/**
 * Phase 1.1: Check-in date normalization.
 * All check-in dates are stored and compared as start-of-day UTC for consistency.
 */

/**
 * Normalize a date to 00:00:00.000 UTC for that calendar day.
 * Use for storing checkInDate and for duplicate-check / filter ranges.
 */
export function toStartOfDayUTC(input: string | Date): Date {
  const d = typeof input === "string" ? new Date(input) : input;
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  return new Date(Date.UTC(y, m, day, 0, 0, 0, 0));
}

/** Start of the next UTC day (exclusive end for a day range). */
export function startOfNextDayUTC(startOfDay: Date): Date {
  return new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
}
