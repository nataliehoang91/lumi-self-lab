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
 * Sign in and create account entry point.
 */
export default function WelcomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-second/10 dark:from-background dark:via-background dark:to-second/20">
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
