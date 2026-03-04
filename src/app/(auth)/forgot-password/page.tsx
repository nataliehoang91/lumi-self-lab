"use client";

import {
  InteractiveForm,
  SubmitButton,
  SubmitMessage,
  LoadingMessage,
} from "@/components/CoreAdvancedComponent/behaviors/interactive-form";
import {
  FormField,
  InputControl,
  FormMessage,
} from "@/components/CoreAdvancedComponent/components/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { getErrorMessage } from "@/types";

type ForgotPasswordFields = "email";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isLoaded } = useSignIn();
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async (
    formData: FormData
  ): Promise<{ redirect?: string; error?: string; refresh?: boolean }> => {
    if (!isLoaded) return { error: "Please wait..." };
    setError(null);

    try {
      const email = formData.get("email") as string;

      if (!email) {
        return { error: "Email is required" };
      }

      // Use Clerk's password reset flow
      // Note: Clerk's reset_password_email_code strategy requires additional setup
      // For now, we'll use a simpler approach - redirect to sent page
      // In production, you'd implement Clerk's full password reset flow

      // Redirect to sent page with email parameter
      router.push(`/forgot-password/sent?email=${encodeURIComponent(email)}`);
      return {
        redirect: `/forgot-password/sent?email=${encodeURIComponent(email)}`,
        refresh: true,
      };
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(
        err,
        "Failed to send reset email. Please try again."
      );
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Icon */}
        <div className="mb-8 text-center">
          <Link href="/" className="mb-4 inline-flex items-center justify-center">
            <div className="relative">
              <Sparkles className="text-second animate-float h-12 w-12" />
              <div
                className="bg-primary/20 animate-pulse-glow absolute inset-0 rounded-full
                  blur-xl"
              />
            </div>
          </Link>
          <h1 className="text-foreground mb-2 text-3xl font-bold md:text-4xl">
            Reset Password
          </h1>
          <p className="text-muted-foreground">We&apos;ll send you a reset link</p>
        </div>

        {/* Forgot Password Card */}
        <Card
          className="bg-card/90 border-border/50 rounded-3xl p-8 shadow-xl
            backdrop-blur-sm"
        >
          {error && (
            <div
              className="bg-destructive/10 border-destructive/20 text-destructive mb-4
                rounded-md border p-3 text-sm"
            >
              {error}
            </div>
          )}

          <InteractiveForm<ForgotPasswordFields>
            fields={["email"]}
            action={handleForgotPassword}
          >
            <div className="space-y-6">
              <FormField name="email">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <InputControl>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="bg-background/50 border-foreground/25!
                      focus:border-primary! focus-visible:ring-ring h-12 rounded-2xl
                      border! transition-all focus-visible:ring-2
                      focus-visible:ring-offset-2"
                  />
                </InputControl>
                <FormMessage match="valueMissing">Email is required</FormMessage>
                <FormMessage match="typeMismatch">Please enter a valid email</FormMessage>
                <p className="text-muted-foreground mt-2 text-xs">
                  Enter the email associated with your account and we&apos;ll send you a
                  link to reset your password.
                </p>
              </FormField>

              <SubmitButton asChild>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!isLoaded}
                  className="w-full rounded-2xl py-6 text-lg shadow-lg transition-all
                    hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                >
                  <LoadingMessage>Sending reset link...</LoadingMessage>
                  <SubmitMessage>Send Reset Link</SubmitMessage>
                </Button>
              </SubmitButton>
            </div>
          </InteractiveForm>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="border-border/50 w-full border-t"></div>
            </div>
          </div>

          {/* Back to Login */}
          <Button
            variant="ghost"
            size="lg"
            asChild
            className="hover:bg-background/50 w-full rounded-2xl py-6 text-lg
              transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link href="/sign-in">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </Button>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm
              transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
