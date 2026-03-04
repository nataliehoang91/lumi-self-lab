"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Sparkles } from "lucide-react";

export default function ForgotPasswordSentPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

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
        </div>

        <Card
          className="bg-card/90 border-border/50 rounded-3xl p-8 text-center shadow-xl
            backdrop-blur-sm"
        >
          <div
            className="bg-second/10 mb-4 inline-flex h-16 w-16 items-center justify-center
              rounded-full"
          >
            <Mail className="text-second h-8 w-8" />
          </div>

          <h3 className="mb-2 text-lg font-semibold">Check Your Email</h3>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            We&apos;ve sent password reset instructions to <strong>{email}</strong>.
            Please check your inbox and follow the link to reset your password.
          </p>

          <p className="text-muted-foreground mb-8 text-xs">
            If you don&apos;t see the email, check your spam folder or try again.
          </p>

          <div className="space-y-3">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="bg-background/50 hover:bg-background w-full rounded-2xl border-2
                py-6 text-lg backdrop-blur transition-all hover:scale-[1.02]
                active:scale-[0.98]"
            >
              <Link href="/sign-in">Back to Sign In</Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              asChild
              className="hover:bg-background/50 w-full rounded-2xl py-6 text-lg
                transition-all"
            >
              <Link href="/forgot-password">Send another email</Link>
            </Button>
          </div>
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
