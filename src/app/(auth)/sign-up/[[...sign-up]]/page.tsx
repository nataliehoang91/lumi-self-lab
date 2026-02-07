"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * Sign-Up Page using Clerk's built-in <SignUp /> component
 *
 * Using catch-all route [[...sign-up]] as required by Clerk
 * Reference: https://clerk.com/docs/nextjs/guides/development/custom-sign-up-page
 *
 * Clerk's <SignUp /> component automatically handles:
 * - Email/password input fields
 * - Password confirmation (if enabled in Clerk Dashboard)
 * - Social login buttons (if enabled in Clerk Dashboard)
 * - Form validation
 * - Error handling
 * - Loading states
 * - Email verification flow
 * - Sign-in links
 *
 * Auth & identity: Sign-up creates a single user account (1 email = 1 user).
 * Intent ("personal" vs "for my team") does not change identity; both go to /dashboard after sign-up.
 * See docs/auth-identity-decision-2025-02-07.md.
 */
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center mb-4"
          >
            <div className="relative">
              <Sparkles className="w-12 h-12 text-secondary animate-float" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-glow" />
            </div>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Begin Your Journey
          </h1>
          <p className="text-muted-foreground">
            Create an account to start exploring
          </p>
        </div>

        {/* Clerk Sign-Up Component with Custom Styling */}
        <SignUp
          appearance={{
            elements: {
              // Root container
              rootBox: "mx-auto w-full",

              // Main card
              card: "bg-card/90 backdrop-blur-sm border-border/50 rounded-3xl shadow-xl p-8",

              // Header (hidden since we have custom header above)
              headerTitle: "hidden",
              headerSubtitle: "hidden",

              // Form buttons
              formButtonPrimary:
                "w-full text-lg py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90",

              formButtonSecondary:
                "w-full text-lg py-6 rounded-2xl bg-background/50 backdrop-blur border-2 border-border hover:bg-background transition-all hover:scale-[1.02] active:scale-[0.98]",

              // Social buttons (if enabled in Clerk Dashboard) — text-foreground for dark mode visibility
              socialButtonsBlockButton:
                "w-full text-lg py-6 rounded-2xl bg-background/50 backdrop-blur border-2 border-border hover:bg-background transition-all hover:scale-[1.02] active:scale-[0.98] text-foreground",
              socialButtonsBlockButtonText: "text-foreground",

              // Input fields
              formFieldInput:
                "h-12 rounded-2xl bg-background/50 border border-foreground/25 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all",

              formFieldLabel: "text-sm font-medium text-foreground",

              // Dividers
              dividerLine: "border-border/50",
              dividerText: "text-muted-foreground text-sm bg-card px-4",

              // Links
              footerActionLink: "text-primary hover:underline transition-all",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-primary hover:text-primary/80",

              // Error messages
              formFieldErrorText: "text-destructive text-sm",
              alertText: "text-destructive",
              formResendCodeLink: "text-primary hover:underline",
            },
            layout: {
              socialButtonsPlacement: "top",
              socialButtonsVariant: "blockButton",
            },
            variables: {
              colorPrimary: "var(--primary)",
              colorBackground: "var(--background)",
              colorInputBackground: "var(--input)",
              colorInputText: "var(--foreground)",
              colorText: "var(--foreground)",
              colorTextSecondary: "var(--muted-foreground)",
              colorDanger: "var(--destructive)",
              borderRadius: "1.25rem",
              fontFamily: "var(--font-sans)",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          waitlistUrl="/waitlist"
          signInFallbackRedirectUrl="/dashboard"
          signInForceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
          forceRedirectUrl="/dashboard"
          oauthFlow="redirect"
        />

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
