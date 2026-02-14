/**
 * Phase R.1 + R.3 + R.4 — Daily check-in reminder cron (email only).
 * Finds active experiments where lastCheckInDate < today UTC; skips if paused (R.3) or snoozed (R.4).
 * Secure: callable only with CRON_SECRET (Bearer or x-cron-secret).
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toStartOfDayUTC } from "@/lib/date-utils";
import { sendCheckInReminderEmail } from "@/lib/checkin-reminder-email";

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

  const todayStart = toStartOfDayUTC(new Date());
  const baseUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3005";

  try {
    const activeExperiments = await prisma.experiment.findMany({
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
          select: { email: true },
        },
        reminder: {
          select: { pausedAt: true, snoozedUntil: true },
        },
      },
    });

    const now = new Date();
    const needsReminder = activeExperiments.filter((exp) => {
      if (exp.reminder?.pausedAt != null) return false;
      if (exp.reminder?.snoozedUntil != null && now < exp.reminder.snoozedUntil) return false;
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
      remindersSent: sent,
      totalEligible: needsReminder.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("Check-in reminders cron error:", err);
    return NextResponse.json({ error: "Failed to run check-in reminders" }, { status: 500 });
  }
}
