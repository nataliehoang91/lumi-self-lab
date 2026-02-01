"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Mail,
  Check,
  ArrowRight,
  Heart,
  Brain,
  Users,
  Lightbulb,
} from "lucide-react";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to join waitlist");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-violet-50/30 dark:from-background dark:via-background dark:to-violet-950/20">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            Self-Lab
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="#waitlist-form">Early Access</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  Opening Soon
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
                Understand yourself through reflection
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Self-Lab is a calm space to design personal experiments and
                discover patterns about yourself. Join our waitlist for exclusive
                early access.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="w-3.5 h-3.5 text-violet" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Personal Experiments
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Design your own self-discovery journeys
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Brain className="w-3.5 h-3.5 text-violet" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    AI-Guided Reflection
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Thoughtful prompts and insights from AI
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-violet" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Team & Org Features
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Share experiments with your community
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb className="w-3.5 h-3.5 text-violet" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Deep Insights</p>
                  <p className="text-sm text-muted-foreground">
                    Visualize patterns and growth over time
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <Card className="p-4 bg-card/50 border-border/30 rounded-2xl text-center">
                <p className="text-2xl font-bold text-primary">5K+</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Waitlist Members
                </p>
              </Card>
              <Card className="p-4 bg-card/50 border-border/30 rounded-2xl text-center">
                <p className="text-2xl font-bold text-violet">50+</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Beta Testers
                </p>
              </Card>
              <Card className="p-4 bg-card/50 border-border/30 rounded-2xl text-center">
                <p className="text-2xl font-bold text-primary">2026</p>
                <p className="text-xs text-muted-foreground mt-1">Launch Year</p>
              </Card>
            </div>
          </div>

          {/* Right Column - Form */}
          <div id="waitlist-form">
            <Card className="p-8 md:p-10 bg-card/80 backdrop-blur border-border/40 rounded-3xl shadow-lg">
              {!submitted ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-foreground">
                      Join the Waitlist
                    </h2>
                    <p className="text-muted-foreground">
                      Be the first to know when we launch
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-12 h-12 rounded-xl bg-muted/50 border-border/40 text-foreground placeholder:text-muted-foreground focus:bg-muted/70 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded border-border/40 bg-muted/50 text-primary accent-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          Send me updates about Self-Lab
                        </span>
                      </label>
                    </div>

                    {error && (
                      <p className="text-sm text-destructive text-center">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full h-12 rounded-xl font-semibold text-base gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="inline-block w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          Join Waitlist
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-xs text-muted-foreground text-center">
                    We care about your privacy. No spam, ever.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-foreground">
                      Welcome to the waitlist!
                    </h3>
                    <p className="text-muted-foreground">
                      We&apos;ll send you updates and notify you as soon as early
                      access becomes available.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground pt-2">
                    Check your email for a confirmation ({email})
                  </p>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full rounded-xl h-11 bg-transparent"
                  >
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              )}
            </Card>

            {/* Trust Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-primary">
                    ★
                  </span>
                ))}
              </div>
              <span>Trusted by early adopters</span>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-24 pt-24 border-t border-border/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What People Are Saying
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Early users share how Self-Lab is transforming their self-awareness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "A truly calm space to think deeply about myself without judgment.",
                author: "Alex K.",
                role: "Designer",
              },
              {
                quote:
                  "The AI prompts are surprisingly thoughtful. It feels like talking to a wise friend.",
                author: "Jordan M.",
                role: "Entrepreneur",
              },
              {
                quote:
                  "I discovered patterns about myself I never noticed before.",
                author: "Sam L.",
                role: "Therapist",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 bg-card/50 border-border/30 rounded-2xl hover:bg-card/70 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-24 text-center py-12 border-t border-border/30">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">
              Ready to explore yourself?
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Be among the first to access Self-Lab and begin your journey of
              self-discovery
            </p>
            <Button size="lg" className="rounded-xl gap-2" asChild>
              <Link href="#waitlist-form">
                Join the Waitlist
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-24 py-12 bg-card/30 backdrop-blur">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-semibold text-foreground mb-4">Self-Lab</p>
              <p className="text-sm text-muted-foreground">
                A space for personal reflection and discovery.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground text-sm mb-4">
                Product
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground text-sm mb-4">
                Company
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground text-sm mb-4">Legal</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 pt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2026 Self-Lab. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="text-sm">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="text-sm">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
