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
import { LogoWithSmallerText, SuccessCheck } from "@/components/GeneralComponents";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/**
 * Public waitlist page. Route: /waitlist (public portal).
 */
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
    <div className="waitlist-background">
      <nav className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-lg bg-gradient-peach/90">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
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
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="outline"
                  className="gap-1.5 px-3 py-1 bg-sky-blue/10 border-sky-blue/30 text-sky-blue"
                >
                  <span className="size-2 rounded-full bg-sky-blue animate-pulse" />
                  Opening Soon
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
                  Understand yourself through reflection
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                  Self-Lab is a calm space to design personal experiments and discover patterns
                  about yourself. Join our waitlist for exclusive early access.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Heart className="w-3.5 h-3.5 text-violet" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Personal Experiments</p>
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
                    <p className="font-medium text-foreground">AI-Guided Reflection</p>
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
                    <p className="font-medium text-foreground">Team & Org Features</p>
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

              <div className="grid grid-cols-3 gap-4 pt-4">
                <Card className="p-4 bg-card/50 border-border/30 rounded-2xl text-center">
                  <p className="text-2xl font-bold text-tertiary">500+</p>
                  <p className="text-xs text-muted-foreground mt-1">Waitlist Members</p>
                </Card>
                <Card className="p-4 bg-card/50 border-border/30 rounded-2xl text-center">
                  <p className="text-2xl font-bold text-second">50+</p>
                  <p className="text-xs text-muted-foreground mt-1">Beta Testers</p>
                </Card>
                <Card className="p-4 bg-card/50 border-border/30 rounded-2xl text-center">
                  <p className="text-2xl font-bold text-coral">2026</p>
                  <p className="text-xs text-muted-foreground mt-1">Launch Year</p>
                </Card>
              </div>
            </div>

            <div id="waitlist-form">
              <Card className="p-8 md:p-10 bg-card/80 backdrop-blur border-border/40 rounded-3xl shadow-lg">
                {!submitted ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold text-foreground">Join the Waitlist</h2>
                      <p className="text-muted-foreground">Be the first to know when we launch</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
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
                            className={cn(
                              "pl-12 h-12 rounded-xl border-border/40 text-foreground transition-colors",
                              "bg-muted/50 placeholder:text-muted-foreground focus:bg-muted/70"
                            )}
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

                      {error && <p className="text-sm text-destructive text-center">{error}</p>}

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
                    <SuccessCheck size="md" />
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-foreground">
                        Welcome to the waitlist!
                      </h3>
                      <p className="text-muted-foreground">
                        We&apos;ll send you updates and notify you as soon as early access becomes
                        available.
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
        </Container>
      </main>

      <footer className=" border-border/30 mt-8 py-8 backdrop-blur">
        <Container maxWidth="7xl" className="px-4 md:px-6 ">
          <div className=" border-border/30  flex items-center justify-between">
            <p className="text-sm text-muted-foreground">© 2026 Self-Lab. All rights reserved.</p>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Trust Badge */}
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">
                  All your reflections are private and encrypted. We never sell your data.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-10 h-10 rounded-xl bg-card/60 backdrop-blur border border-border/50 flex items-center justify-center text-muted-foreground transition-all duration-200 hover:scale-110 hover:border-sky-blue/50 hover:bg-sky-blue/10 hover:text-sky-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-blue focus-visible:ring-offset-2"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-10 h-10 rounded-xl bg-card/60 backdrop-blur border border-border/50 flex items-center justify-center text-muted-foreground transition-all duration-200 hover:scale-110 hover:border-coral/50 hover:bg-coral/10 hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-10 h-10 rounded-xl bg-card/60 backdrop-blur border border-border/50 flex items-center justify-center text-muted-foreground transition-all duration-200 hover:scale-110 hover:border-slate-500/50 hover:bg-slate-500/10 hover:text-slate-600 dark:hover:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
