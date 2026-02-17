"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "@/components/GeneralComponents/Logo";

/**
 * Client-only sign-up form (Clerk may access request data).
 * Rendered inside Suspense by the page so prerender works with cacheComponents.
 */
export function SignUpForm() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 animate-float">
            <Logo href="/" className="w-12 md:w-12" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Begin Your Journey
          </h1>
          <p className="text-muted-foreground">Create an account to start exploring</p>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "bg-card/90 backdrop-blur-sm border-border/50 rounded-3xl shadow-xl p-8",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formButtonPrimary:
                "w-full text-lg py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90",
              formButtonSecondary:
                "w-full text-lg py-6 rounded-2xl bg-background/50 backdrop-blur border-2 border-border hover:bg-background transition-all hover:scale-[1.02] active:scale-[0.98]",
              socialButtonsBlockButton:
                "w-full text-lg py-6 rounded-2xl bg-background/50 backdrop-blur border-2 border-border hover:bg-background transition-all hover:scale-[1.02] active:scale-[0.98] text-foreground",
              socialButtonsBlockButtonText: "text-foreground",
              formFieldInput:
                "h-12 rounded-2xl bg-background/50 border border-foreground/25 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all",
              formFieldLabel: "text-sm font-medium text-foreground",
              dividerLine: "border-border/50",
              dividerText: "text-muted-foreground text-sm bg-card px-4",
              footerActionLink: "text-primary hover:underline transition-all",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-primary hover:text-primary/80",
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
