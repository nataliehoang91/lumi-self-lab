# Phase R.1 — Daily Check-in Reminder (Email, minimal)

**Date:** 2026-01-29

---

## Goal

Remind users to check in when an experiment is **active** and they have not yet checked in **today** (UTC). Email only; no schema changes; no push notifications; no per-field frequency.

---

## Rules

- **No schema changes.** Read-only use of Experiment, ExperimentCheckIn, User (for owner email).
- **No frequency per field.** Reminder is per experiment (daily when eligible).
- **No push notifications.** Email only.
- **Isolated logic.** Reminder logic lives in cron route + email helper; no changes to experiment or check-in APIs.

---

## Cron job

**Endpoint:** `GET /api/cron/checkin-reminders`

**Auth:** Caller must send either:

- `Authorization: Bearer <CRON_SECRET>`, or  
- `x-cron-secret: <CRON_SECRET>`

If `CRON_SECRET` is not set or the request does not match, the route returns **401**.

**Logic:**

1. Compute **today UTC** as start-of-day (00:00:00.000 UTC).
2. Find experiments where:
   - `status = 'active'`
   - `startedAt` is not null
3. For each such experiment, take the **latest check-in** (max `checkInDate`). If there is no check-in, or the latest `checkInDate` is **before** today UTC, the experiment is **eligible** for a reminder.
4. For each eligible experiment, resolve the **owner email** (via `Experiment.user.email` or User by `clerkUserId`). If no email, skip and log.
5. Send **one reminder email per eligible experiment** (experiment title + CTA link to experiment detail page).

**Response:** JSON `{ ok: true, remindersSent, totalEligible, errors? }`.

---

## Email content

- **Subject:** `Check in: <experiment title>`
- **Body:** Short line that it’s time for a daily check-in, experiment title, and a single **CTA link** to the experiment detail page: `/experiments/[id]`.
- **From:** `RESEND_FROM_EMAIL` env (default: `Lumi Self-Lab <onboarding@resend.dev>` when using Resend’s onboarding domain).

---

## Environment

| Variable | Purpose |
|----------|--------|
| `CRON_SECRET` | Required. Secret used to authorize cron requests (Bearer or `x-cron-secret`). |
| `RESEND_API_KEY` | Required for sending. Resend API key. |
| `RESEND_FROM_EMAIL` | Optional. From address (default uses Resend onboarding domain). |
| `APP_URL` or `NEXT_PUBLIC_APP_URL` | Optional. Base URL for CTA link (e.g. `https://app.example.com`). Fallback: `http://localhost:3005`. |

---

## Schedule

**Vercel Cron:** `vercel.json` defines one cron:

- **Path:** `/api/cron/checkin-reminders`
- **Schedule:** `0 14 * * *` (14:00 UTC daily).

Adjust the cron expression in `vercel.json` if you want a different time.

---

## Files

| File | Purpose |
|------|--------|
| `src/lib/checkin-reminder-email.ts` | Resend client; `sendCheckInReminderEmail()` — one email per experiment. |
| `src/app/api/cron/checkin-reminders/route.ts` | GET handler: find eligible experiments, send reminders, return count. |
| `vercel.json` | Cron schedule for the reminder job. |

---

## Out of scope (Phase R.1)

- Pause reminders
- Custom reminder times per user
- Per-field frequency
- AI
- Schema or migration changes
