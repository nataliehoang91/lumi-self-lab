/**
 * Phase R.1 — Check-in reminder email (Resend).
 * Isolated: no schema changes; sends one email per experiment.
 */

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Lumi Self-Lab <onboarding@resend.dev>";

export type SendReminderParams = {
  to: string;
  experimentTitle: string;
  experimentId: string;
  experimentDetailUrl: string;
};

/**
 * Sends a single check-in reminder email.
 * Returns { ok: true } or { ok: false, error: string }.
 */
export async function sendCheckInReminderEmail(
  params: SendReminderParams
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const { to, experimentTitle, experimentDetailUrl } = params;

  const subject = `Check in: ${experimentTitle}`;
  const html = `
    <p>Time for your daily check-in.</p>
    <p><strong>${escapeHtml(experimentTitle)}</strong></p>
    <p><a href="${escapeHtml(experimentDetailUrl)}">Open experiment & check in</a></p>
    <p style="color:#666;font-size:12px;">Lumi Self-Lab — daily reminder</p>
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    return { ok: false, error: message };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
