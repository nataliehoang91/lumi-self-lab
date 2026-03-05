import { WaitlistClient } from "./WaitlistClient";

/**
 * Public waitlist page. Route: /waitlist (public portal).
 * On Vercel production, the marketing block (tagline, features, stats) is hidden.
 */
export default function WaitlistPage() {
  const isProduction = process.env.VERCEL_ENV === "production";

  return <WaitlistClient showMarketing={!isProduction} />;
}
