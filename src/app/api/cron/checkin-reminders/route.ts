/**
 * Phase R.1 + R.3 + R.4 — Daily check-in reminder cron (email only).
 * Finds active experiments where lastCheckInDate < today UTC; skips if paused (R.3) or snoozed (R.4).
 * Respects user notification preferences: reminderEmailEnabled and reminderTimeSlot.
 * Secure: callable only with CRON_SECRET (Bearer or x-cron-secret).
 *
 * Note: reminderEmailEnabled / reminderTimeSlot are new User fields not yet reflected in the
 * generated Prisma client. After running `prisma generate` the cast can be removed.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toStartOfDayUTC } from "@/lib/date-utils";
import { sendCheckInReminderEmail } from "@/lib/checkin-reminder-email";

const VALID_SLOTS = ["morning", "afternoon", "evening"] as const;
type Slot = (typeof VALID_SLOTS)[number];

type ExpRow = {
  id: string;
  title: string;
  clerkUserId: string;
  checkIns: { checkInDate: Date }[];
  user: {
    email: string | null;
    reminderEmailEnabled: boolean;
    reminderTimeSlot: string;
  } | null;
  reminder: { pausedAt: Date | null; snoozedUntil: Date | null } | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ") && auth.slice(7) === secret) return true;
  if (request.headers.get("x-cron-secret") === secret) return true;
  return false;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const rawSlot = url.searchParams.get("slot") ?? "morning";
  const slot: Slot = VALID_SLOTS.includes(rawSlot as Slot) ? (rawSlot as Slot) : "morning";

  const todayStart = toStartOfDayUTC(new Date());
  const baseUrl =
    process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://selfwithin.space";

  // Test mode: ?to=email sends a single test email, skips DB
  const testTo = url.searchParams.get("to");
  if (testTo) {
    const result = await sendCheckInReminderEmail({
      to: testTo,
      experimentTitle: "Test Experiment",
      experimentId: "test-id",
      experimentDetailUrl: `${baseUrl}/experiments/test-id`,
    });
    return NextResponse.json({ ok: result.ok, test: true, to: testTo, error: result.ok ? undefined : (result as { ok: false; error: string }).error });
  }

  try {
    const activeExperiments: ExpRow[] = await db.experiment.findMany({
      where: {
        status: "active",
        startedAt: { not: null },
      },
      select: {
        id: true,
        title: true,
        clerkUserId: true,
        checkIns: {
          orderBy: { checkInDate: "desc" },
          take: 1,
          select: { checkInDate: true },
        },
        user: {
          select: {
            email: true,
            reminderEmailEnabled: true,
            reminderTimeSlot: true,
          },
        },
        reminder: {
          select: { pausedAt: true, snoozedUntil: true },
        },
      },
    });

    const now = new Date();
    const needsReminder = activeExperiments.filter((exp) => {
      if (!exp.user?.reminderEmailEnabled) return false;
      if (exp.user?.reminderTimeSlot !== slot) return false;
      if (exp.reminder?.pausedAt != null) return false;
      if (exp.reminder?.snoozedUntil != null && now < exp.reminder.snoozedUntil)
        return false;
      const latest = exp.checkIns[0];
      if (!latest) return true;
      return latest.checkInDate < todayStart;
    });

    let sent = 0;
    const errors: string[] = [];

    for (const exp of needsReminder) {
      const email = exp.user?.email?.trim();
      if (!email) {
        errors.push(`Experiment ${exp.id}: no owner email`);
        continue;
      }
      const result = await sendCheckInReminderEmail({
        to: email,
        experimentTitle: exp.title,
        experimentId: exp.id,
        experimentDetailUrl: `${baseUrl.replace(/\/$/, "")}/experiments/${exp.id}`,
      });
      if (result.ok) sent++;
      else errors.push(`Experiment ${exp.id}: ${result.error}`);
    }

    return NextResponse.json({
      ok: true,
      slot,
      remindersSent: sent,
      totalEligible: needsReminder.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("Check-in reminders cron error:", err);
    return NextResponse.json(
      { error: "Failed to run check-in reminders" },
      { status: 500 }
    );
  }
}
