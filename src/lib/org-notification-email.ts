/**
 * Branded org invitation email for SelfWithin.
 * Sent when a member is added/assigned to an org experiment.
 */

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "SelfWithin <onboarding@resend.dev>";

export type SendOrgInviteParams = {
  to: string;
  memberName: string;
  orgName: string;
  experimentTitle: string;
  experimentUrl: string;
};

export async function sendOrgInviteEmail(
  params: SendOrgInviteParams
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const { to, memberName, orgName, experimentTitle, experimentUrl } = params;
  const subject = `You've been invited to an experiment: ${experimentTitle}`;
  const html = buildOrgInviteHtml(memberName, orgName, experimentTitle, experimentUrl);

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

function buildOrgInviteHtml(
  memberName: string,
  orgName: string,
  experimentTitle: string,
  ctaUrl: string
): string {
  const name = escapeHtml(memberName);
  const org = escapeHtml(orgName);
  const title = escapeHtml(experimentTitle);
  const url = escapeHtml(ctaUrl);
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
          <!-- Gradient accent bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#f97316,#fb923c);"></td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.5px;">SelfWithin</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#f97316;text-transform:uppercase;letter-spacing:0.5px;">Experiment Invitation</p>
              <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#111827;line-height:1.3;">Hi ${name},</h1>
              <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
                <strong>${org}</strong> has added you to a new experiment:
              </p>
              <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:4px;padding:16px 20px;margin:0 0 32px;">
                <p style="margin:0;font-size:17px;font-weight:600;color:#111827;">${title}</p>
              </div>
              <p style="margin:0 0 32px;font-size:15px;color:#6b7280;line-height:1.6;">Your experiment is waiting for today's data. Open the link below to get started.</p>
              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:#f97316;">
                    <a href="${url}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">View Experiment &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #f0f0f0;background:#fafafa;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                You're receiving this because you were added to an experiment on SelfWithin.<br>
                To manage your notifications, visit your <a href="${escapeHtml(process.env.NEXT_PUBLIC_APP_URL ?? "https://selfwithin.app")}/settings/notifications" style="color:#f97316;text-decoration:none;">notification preferences</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
