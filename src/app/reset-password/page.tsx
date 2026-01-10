"use client";

import { TaskResetPassword } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * Reset Password Page using Clerk's built-in <TaskResetPassword /> component
 * 
 * This component is rendered when a user has clicked a reset password link
 * from their email and has a `reset-password` session task.
 * 
 * The <TaskResetPassword /> component automatically handles:
 * - Password reset form
 * - Form validation
 * - Error handling
 * - Loading states
 * - Redirect after successful reset
 * 
 * Reference: https://clerk.com/docs/nextjs/reference/components/authentication/task-reset-password
 * 
 * Note: This component cannot render when a user doesn't have current session tasks.
 * Clerk's SignIn component automatically redirects users here when they have a reset-password task.
 */
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-secondary animate-float" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-glow" />
            </div>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Reset Password</h1>
          <p className="text-muted-foreground">Enter your new password</p>
        </div>

        {/* Clerk TaskResetPassword Component with Custom Styling */}
        <TaskResetPassword
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
              
              // Input fields
              formFieldInput:
                "h-12 rounded-2xl bg-background/50 border border-foreground/25 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all",
              
              formFieldLabel: "text-sm font-medium text-foreground",
              
              // Links
              footerActionLink: "text-primary hover:underline transition-all",
              
              // Error messages
              formFieldErrorText: "text-destructive text-sm",
              alertText: "text-destructive",
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
          redirectUrlComplete="/sign-in"
        />

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
