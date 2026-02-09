"use client";

/**
 * Phase R.2 + R.4 — In-app check-in reminder banner.
 * Shown IFF: experiment active, started, no check-in today (UTC), reminder not paused, not snoozed.
 * Uses same UTC date logic as Phase 1.1 (date-utils).
 */

import { toStartOfDayUTC } from "@/lib/date-utils";

export type ExperimentWithCheckIns = {
  id: string;
  status: string;
  startDate: string | null;
  checkIns: Array<{ checkInDate: string }>;
};

export type ReminderState = {
  paused: boolean;
  pausedAt: string | null;
  snoozed?: boolean;
  snoozedUntil?: string | null;
};

function getTodayUTCDateString(): string {
  return toStartOfDayUTC(new Date()).toISOString().split("T")[0];
}

function hasCheckInToday(checkIns: Array<{ checkInDate: string }>, todayStr: string): boolean {
  return checkIns.some((c) => c.checkInDate === todayStr);
}

function shouldShowBanner(
  experiment: ExperimentWithCheckIns,
  reminder: ReminderState
): boolean {
  if (experiment.status !== "active") return false;
  if (!experiment.startDate) return false;
  const todayStr = getTodayUTCDateString();
  if (hasCheckInToday(experiment.checkIns, todayStr)) return false;
  if (reminder.paused) return false;
  if (reminder.snoozed === true) return false;
  if (
    reminder.snoozedUntil != null &&
    reminder.snoozedUntil !== "" &&
    new Date(reminder.snoozedUntil) > new Date()
  )
    return false;
  return true;
}

export interface CheckInReminderBannerProps {
  experiment: ExperimentWithCheckIns;
  reminder: ReminderState;
  children?: React.ReactNode;
}

/**
 * Renders a reminder banner when the user should check in today (UTC) and reminders are not paused.
 * Pass `children` to render a CTA (e.g. "Check in" button) inside the banner.
 */
export function CheckInReminderBanner({
  experiment,
  reminder,
  children,
}: CheckInReminderBannerProps) {
  if (!shouldShowBanner(experiment, reminder)) return null;

  return (
    <div
      role="status"
      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/40"
    >
      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
        You haven&apos;t checked in today. Add your check-in when you&apos;re ready.
      </p>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
