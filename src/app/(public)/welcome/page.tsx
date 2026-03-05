import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import {
  WelcomeHeader,
  WelcomeCTAs,
  WelcomeFeatureCards,
  WelcomeTrustBadge,
  WelcomeThemeToggle,
} from "@/components/WelcomePage";

/**
 * Welcome page. Route: /welcome (public).
 * On Vercel production, redirects to /waitlist.
 */
export default function WelcomePage() {
  if (process.env.VERCEL_ENV === "production") {
    redirect("/waitlist");
  }

  return (
    <div className="welcome-page-background relative">
      <WelcomeThemeToggle />
      <Container maxWidth="5xl" className="px-4 py-16 md:py-24">
        <WelcomeHeader />
        <WelcomeCTAs />
        <WelcomeFeatureCards />
        <WelcomeTrustBadge />
      </Container>
    </div>
  );
}
