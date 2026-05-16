import crypto from "crypto";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? process.env.NEXTAUTH_SECRET ?? "dev-admin-secret-change-me";
const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

// ── Password hashing (scrypt) ─────────────────────────────────────────────────

export async function hashAdminPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key)));
  });
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyAdminPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const incoming = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key)));
  });
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), incoming);
}

// ── Session token (HMAC-signed clerkUserId) ───────────────────────────────────

export function createAdminSessionToken(clerkUserId: string): string {
  const payload = `${clerkUserId}:${Date.now()}`;
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyAdminSessionToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const lastColon = decoded.lastIndexOf(":");
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return null;
    const colonIdx = payload.indexOf(":");
    const clerkUserId = payload.slice(0, colonIdx);
    const ts = Number(payload.slice(colonIdx + 1));
    // Expire after 8 hours
    if (Date.now() - ts > COOKIE_MAX_AGE * 1000) return null;
    return clerkUserId;
  } catch {
    return null;
  }
}

export { COOKIE_NAME, COOKIE_MAX_AGE };
