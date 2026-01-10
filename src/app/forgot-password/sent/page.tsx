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
        </div>

        <Card className="p-8 bg-card/90 backdrop-blur-sm border-border/50 rounded-3xl shadow-xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
            <Mail className="w-8 h-8 text-secondary" />
          </div>
          
          <h3 className="font-semibold text-lg mb-2">Check Your Email</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            We&apos;ve sent password reset instructions to <strong>{email}</strong>. Please check your inbox and follow the
            link to reset your password.
          </p>
          
          <p className="text-xs text-muted-foreground mb-8">
            If you don&apos;t see the email, check your spam folder or try again.
          </p>

          <div className="space-y-3">
            <Button 
              variant="outline" 
              size="lg" 
              asChild 
              className="w-full text-lg py-6 rounded-2xl bg-background/50 backdrop-blur border-2 hover:bg-background transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href="/sign-in">Back to Sign In</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              asChild 
              className="w-full text-lg py-6 rounded-2xl hover:bg-background/50 transition-all"
            >
              <Link href="/forgot-password">Send another email</Link>
            </Button>
          </div>
        </Card>

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
