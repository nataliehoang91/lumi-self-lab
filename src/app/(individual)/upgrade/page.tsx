"use client";

import { Button } from "@/components/ui/button";
import {
  Crown,
  Check,
  Building2,
  Users,
  LayoutGrid,
  BarChart3,
  Shield,
  Sparkles,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Building2,
    title: "Organisation workspaces",
    description: "Build teams and departments for collaborative self-experiments",
    color: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  },
  {
    icon: LayoutGrid,
    title: "Design Templates",
    description: "Create reusable experiment templates for your team members",
    color: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  },
  {
    icon: Users,
    title: "Add & manage members",
    description: "Invite members by email and manage roles across your org",
    color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: BarChart3,
    title: "Aggregate Insights",
    description: "View team-wide trends and patterns while respecting privacy",
    color: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Shield,
    title: "Privacy Controls",
    description: "Fine-grained control over what data is shared and aggregated",
    color: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  },
  {
    icon: Sparkles,
    title: "AI Team Insights",
    description: "AI-powered recommendations tailored to your team's growth",
    color: "bg-primary/15 text-primary",
  },
];

const individualFeatures = [
  "Personal experiments",
  "Unlimited check-ins",
  "Personal insights & analytics",
  "Join organizations as member",
  "Accept experiment invitations",
];

const orgFeatures = [
  "Everything in Individual",
  "Create & manage organisation workspaces",
  "Design experiment templates",
  "Add & manage members",
  "View aggregate team insights",
  "Assign experiments to teams",
  "Privacy-respecting analytics",
];

export default function UpgradePage() {

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-foreground/[0.03] border-border/50 border-b py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <div className="border-border bg-background mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest text-amber-600 uppercase dark:text-amber-400">
            <Crown className="h-3.5 w-3.5" />
            Organisation Plan
          </div>
          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Scale your team&apos;s
            <br />
            <span className="from-primary to-violet-500 bg-gradient-to-r bg-clip-text text-transparent">
              self-discovery practice
            </span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
            Create workspaces, design experiment templates, and get privacy-first aggregate insights — all in one place.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Plan Comparison */}
        <div className="mb-14 grid gap-5 md:grid-cols-2">
          {/* Individual — current */}
          <div className="border-border bg-card rounded-3xl border p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-2xl">
                <Users className="text-muted-foreground h-5 w-5" />
              </div>
              <div>
                <p className="text-foreground font-semibold">Individual</p>
                <p className="text-muted-foreground text-xs">Your current plan</p>
              </div>
            </div>
            <ul className="space-y-3">
              {individualFeatures.map((f) => (
                <li key={f} className="text-muted-foreground flex items-center gap-3 text-sm">
                  <Check className="text-muted-foreground/60 h-4 w-4 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Organisation — upgrade target */}
          <div className="from-foreground to-foreground/90 relative overflow-hidden rounded-3xl bg-gradient-to-br p-7 text-white dark:from-zinc-800 dark:to-zinc-900">
            {/* Subtle glow */}
            <div className="from-primary/20 absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br to-violet-500/20 blur-2xl" />

            <div className="relative mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Organisation</p>
                  <p className="text-white/60 text-xs">For teams & companies</p>
                </div>
              </div>
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
                Recommended
              </span>
            </div>

            <ul className="relative mt-5 mb-6 space-y-3">
              {orgFeatures.map((f, i) => (
                <li key={f} className={cn("flex items-center gap-3 text-sm", i === 0 ? "font-medium text-white" : "text-white/80")}>
                  <Check className={cn("h-4 w-4 shrink-0", i === 0 ? "text-amber-400" : "text-primary")} />
                  {f}
                </li>
              ))}
            </ul>

            <div className="relative space-y-2">
              <Button
                disabled
                className="relative w-full rounded-2xl bg-white/30 py-5 font-semibold text-white/60 cursor-not-allowed"
              >
                Coming Soon
              </Button>
              <p className="text-center text-white/50 text-xs">We&apos;re building this — join the waitlist to get early access.</p>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="mb-14">
          <p className="text-muted-foreground mb-1 text-center text-xs font-semibold tracking-widest uppercase">What you get</p>
          <h2 className="text-foreground mb-8 text-center text-2xl font-bold">Organisation Features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="border-border bg-card hover:border-border/80 group rounded-2xl border p-5 transition-all hover:shadow-sm"
              >
                <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-xl", f.color.split(" ")[0])}>
                  <f.icon className={cn("h-5 w-5", f.color.split(" ").slice(1).join(" "))} />
                </div>
                <p className="text-foreground mb-1 text-sm font-semibold">{f.title}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy footer */}
        <div className="border-border bg-emerald-50/50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-200/60 p-8 text-center dark:border-emerald-900/30">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">
            <Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-foreground mb-2 text-lg font-bold">Privacy is Non-Negotiable</h3>
          <p className="text-muted-foreground mx-auto max-w-lg text-sm leading-relaxed">
            Even with organisation features, you&apos;ll only ever see aggregate data. Individual responses, personal reflections, and text entries are <strong className="text-foreground">never</strong> shared with admins or other members. Trust is the foundation of SelfWithin.
          </p>
        </div>
      </div>
    </div>
  );
}
