/**
 * Example: Using Clerk's Built-in Components with Custom Styling
 *
 * Clerk provides <SignIn />, <SignUp />, and <UserButton /> components
 * that can be styled using the `appearance` prop.
 *
 * However, since we're using InteractiveForm for better control,
 * we recommend using Clerk hooks (useSignIn, useSignUp) with your own forms.
 *
 * If you want to use Clerk's built-in components, here's how to customize them:
 */

"use client";

import { SignIn, SignUp } from "@clerk/nextjs";

export function ClerkSignInWithCustomStyles() {
  return (
    <SignIn
      appearance={{
        elements: {
          // Customize form container
          rootBox: "mx-auto",
          card: "bg-card/90 backdrop-blur-sm border-border/50 rounded-3xl shadow-xl",

          // Customize buttons
          formButtonPrimary:
            "w-full text-lg py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary text-primary-foreground",
          formButtonSecondary:
            "w-full text-lg py-6 rounded-2xl bg-background/50 backdrop-blur border-2 hover:bg-background transition-all",

          // Customize inputs
          formFieldInput:
            "h-12 rounded-2xl bg-background/50 border-border/50 focus:border-primary transition-all",
          formFieldLabel: "text-sm font-medium",

          // Customize headers
          headerTitle: "text-3xl md:text-4xl font-bold text-foreground",
          headerSubtitle: "text-muted-foreground",

          // Customize dividers
          dividerLine: "border-border/50",
          dividerText: "text-muted-foreground",

          // Customize links
          footerActionLink: "text-primary hover:underline transition-all",
        },
        layout: {
          socialButtonsPlacement: "top",
          socialButtonsVariant: "iconButton",
        },
        variables: {
          colorPrimary: "hsl(var(--primary))",
          colorBackground: "hsl(var(--background))",
          colorInputBackground: "hsl(var(--background))",
          colorInputText: "hsl(var(--foreground))",
          colorText: "hsl(var(--foreground))",
          colorTextSecondary: "hsl(var(--muted-foreground))",
          borderRadius: "1.25rem", // matches --radius
        },
      }}
    />
  );
}

export function ClerkSignUpWithCustomStyles() {
  return (
    <SignUp
      appearance={{
        elements: {
          // Same customization options as SignIn
          rootBox: "mx-auto",
          card: "bg-card/90 backdrop-blur-sm border-border/50 rounded-3xl shadow-xl",
          formButtonPrimary:
            "w-full text-lg py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]",
          formFieldInput:
            "h-12 rounded-2xl bg-background/50 border-border/50 focus:border-primary transition-all",
          headerTitle: "text-3xl md:text-4xl font-bold text-foreground",
        },
        variables: {
          colorPrimary: "hsl(var(--primary))",
          borderRadius: "1.25rem",
        },
      }}
    />
  );
}

/**
 * Note: For better control and to use InteractiveForm components,
 * we recommend using Clerk hooks (useSignIn, useSignUp) instead of
 * built-in components. This allows you to:
 *
 * 1. Use your custom form components (InteractiveForm, FormField, etc.)
 * 2. Have full control over the UI/UX
 * 3. Integrate with your existing design system
 * 4. Maintain consistency with your app's patterns
 */
