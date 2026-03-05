"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Mail,
  ArrowRight,
  Heart,
  Brain,
  Users,
  Lightbulb,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { LogoWithSmallerText } from "@/components/GeneralComponents/logo-with-smaller-text";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { SuccessCheck } from "@/components/GeneralComponents/success-check";

type WaitlistClientProps = {
  showMarketing: boolean;
};

/**
 * Client content for the waitlist page. Marketing block is hidden when showMarketing is false (e.g. production).
 */
export function WaitlistClient({ showMarketing }: WaitlistClientProps) {
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
    <div className="waitlist-background">
      <nav
        className="border-border/40 bg-gradient-peach/90 sticky top-0 z-40 border-b
          backdrop-blur-lg dark:bg-black"
      >
        <div
          className="container mx-auto flex max-w-7xl items-center justify-between px-4
            py-4"
        >
          <LogoWithSmallerText href="/" />
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

      <main>
        <Container maxWidth="7xl" className="px-4 py-16 md:px-6 md:py-12">
          <div
            className={cn(
              "grid items-center gap-12 lg:gap-16",
              showMarketing ? "md:grid-cols-2" : "mx-auto max-w-lg grid-cols-1"
            )}
          >
            {showMarketing && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge
                    variant="outline"
                    className="bg-sky-blue/10 border-sky-blue/30 text-sky-blue gap-1.5
                      px-3 py-1"
                  >
                    <span className="bg-sky-blue size-2 animate-pulse rounded-full" />
                    Opening Soon
                  </Badge>
                  <h1
                    className="text-foreground text-5xl leading-tight font-bold
                      text-balance md:text-6xl"
                  >
                    Understand yourself through reflection
                  </h1>
                  <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
                    Self-Lab is a calm space to design personal experiments and discover
                    patterns about yourself. Join our waitlist for exclusive early access.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="bg-violet/20 mt-0.5 flex h-6 w-6 flex-shrink-0
                        items-center justify-center rounded-full"
                    >
                      <Heart className="text-violet h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Personal Experiments</p>
                      <p className="text-muted-foreground text-sm">
                        Design your own self-discovery journeys
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="bg-violet/20 mt-0.5 flex h-6 w-6 flex-shrink-0
                        items-center justify-center rounded-full"
                    >
                      <Brain className="text-violet h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">AI-Guided Reflection</p>
                      <p className="text-muted-foreground text-sm">
                        Thoughtful prompts and insights from AI
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="bg-violet/20 mt-0.5 flex h-6 w-6 flex-shrink-0
                        items-center justify-center rounded-full"
                    >
                      <Users className="text-violet h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Team & Org Features</p>
                      <p className="text-muted-foreground text-sm">
                        Share experiments with your community
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="bg-violet/20 mt-0.5 flex h-6 w-6 flex-shrink-0
                        items-center justify-center rounded-full"
                    >
                      <Lightbulb className="text-violet h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Deep Insights</p>
                      <p className="text-muted-foreground text-sm">
                        Visualize patterns and growth over time
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <Card
                    className="bg-card/50 border-border/30 rounded-2xl p-4 text-center"
                  >
                    <p className="text-tertiary text-2xl font-bold">500+</p>
                    <p className="text-muted-foreground mt-1 text-xs">Waitlist Members</p>
                  </Card>
                  <Card
                    className="bg-card/50 border-border/30 rounded-2xl p-4 text-center"
                  >
                    <p className="text-second text-2xl font-bold">50+</p>
                    <p className="text-muted-foreground mt-1 text-xs">Beta Testers</p>
                  </Card>
                  <Card
                    className="bg-card/50 border-border/30 rounded-2xl p-4 text-center"
                  >
                    <p className="text-coral text-2xl font-bold">2026</p>
                    <p className="text-muted-foreground mt-1 text-xs">Launch Year</p>
                  </Card>
                </div>
              </div>
            )}

            <div id="waitlist-form">
              <Card
                className="bg-card/80 border-border/40 rounded-3xl p-8 shadow-lg
                  backdrop-blur md:p-10"
              >
                {!submitted ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-foreground text-2xl font-semibold">
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
                          className="text-foreground text-sm font-medium"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail
                            className="text-muted-foreground pointer-events-none absolute
                              top-1/2 left-4 h-5 w-5 -translate-y-1/2"
                          />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={cn(
                              `border-border/40 text-foreground h-12 rounded-xl pl-12
                                transition-colors`,
                              `bg-muted/50 placeholder:text-muted-foreground
                                focus:bg-muted/70`
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="border-border/40 bg-muted/50 text-primary
                              accent-primary h-4 w-4 rounded"
                          />
                          <span className="text-muted-foreground text-sm">
                            Send me updates about SelfWithin
                          </span>
                        </label>
                      </div>

                      {error && (
                        <p className="text-destructive text-center text-sm">{error}</p>
                      )}

                      <Button
                        type="submit"
                        disabled={loading || !email}
                        className="h-12 w-full gap-2 rounded-xl text-base font-semibold"
                      >
                        {loading ? (
                          <>
                            <span
                              className="border-primary-foreground/30
                                border-t-primary-foreground inline-block h-4 w-4
                                animate-spin rounded-full border-2"
                            />
                            Joining...
                          </>
                        ) : (
                          <>
                            Join Waitlist
                            <ArrowRight className="h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </form>

                    <p className="text-muted-foreground text-center text-xs">
                      We care about your privacy. No spam, ever.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 text-center">
                    <SuccessCheck size="md" />
                    <div className="space-y-2">
                      <h3 className="text-foreground text-2xl font-semibold">
                        Welcome to the waitlist!
                      </h3>
                      <p className="text-muted-foreground">
                        We&apos;ll send you updates and notify you as soon as early access
                        becomes available.
                      </p>
                    </div>
                    <p className="text-muted-foreground pt-2 text-sm">
                      Check your email for a confirmation ({email})
                    </p>
                    <Button
                      variant="outline"
                      asChild
                      className="h-11 w-full rounded-xl bg-transparent"
                    >
                      <Link href="/">Back to Home</Link>
                    </Button>
                  </div>
                )}
              </Card>

              <div
                className="text-muted-foreground mt-6 flex items-center justify-center
                  gap-2 text-sm"
              >
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
        </Container>
      </main>

      <footer className="border-border/30 mt-8 py-8 backdrop-blur">
        <Container maxWidth="7xl" className="px-4 md:px-6">
          <div
            className="border-border/30 flex flex-col items-center gap-6 text-center
              md:flex-row md:items-center md:justify-between md:text-left"
          >
            <p className="text-muted-foreground text-sm">
              © 2026 SelfWithin. All rights reserved.
            </p>
            <div
              className="flex flex-col items-center gap-4 md:flex-row md:items-center
                md:gap-6"
            >
              {/* Trust Badge */}
              <div className="text-center md:text-left">
                <p className="text-muted-foreground max-w-sm text-sm">
                  All your reflections are private and encrypted. We never sell your data.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-card/60 border-border/50 text-muted-foreground
                    hover:border-sky-blue/50 hover:bg-sky-blue/10 hover:text-sky-blue
                    focus-visible:ring-sky-blue relative flex h-10 w-10 items-center
                    justify-center rounded-xl border backdrop-blur transition-all
                    duration-200 hover:scale-110 focus-visible:ring-2
                    focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-card/60 border-border/50 text-muted-foreground
                    hover:border-coral/50 hover:bg-coral/10 hover:text-coral
                    focus-visible:ring-coral relative flex h-10 w-10 items-center
                    justify-center rounded-xl border backdrop-blur transition-all
                    duration-200 hover:scale-110 focus-visible:ring-2
                    focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-card/60 border-border/50 text-muted-foreground
                    relative flex h-10 w-10 items-center justify-center rounded-xl border
                    backdrop-blur transition-all duration-200 hover:scale-110
                    hover:border-slate-500/50 hover:bg-slate-500/10 hover:text-slate-600
                    focus-visible:ring-2 focus-visible:ring-slate-500
                    focus-visible:ring-offset-2 focus-visible:outline-none
                    dark:hover:text-slate-400"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
