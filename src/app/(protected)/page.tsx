import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function ProtectedHomePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-md md:max-w-2xl">
        {/* Header */}
        <header className="mb-12 md:mb-16 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-secondary animate-float" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-glow" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance text-foreground leading-tight">
            Welcome to Self-Lab
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 text-pretty leading-relaxed max-w-md mx-auto">
            Explore your inner life, one reflection at a time.
          </p>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col gap-3 mb-8">
          <Button
            size="lg"
            asChild
            className="w-full text-lg py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link href="/dashboard">Start New Experiment</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="w-full text-lg py-6 rounded-2xl bg-card/80 backdrop-blur border-2 hover:bg-card transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link href="/experiments">View Past Reflections</Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="space-y-4">
          <Card className="p-6 bg-card/90 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 rounded-3xl">
            <h3 className="font-semibold text-lg mb-2 text-card-foreground">
              A Space for Reflection
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Self-Lab is not a therapy app or a to-do list. It's a calm,
              private space to slow down and observe your thoughts, emotions,
              and life patterns.
            </p>
          </Card>

          <Card className="p-6 bg-card/90 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 rounded-3xl">
            <h3 className="font-semibold text-lg mb-2 text-card-foreground">
              Gentle AI Guidance
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Get supportive, non-judgmental help from AI as you design personal
              experiments to understand yourself better.
            </p>
          </Card>

          <Card className="p-6 bg-card/90 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 rounded-3xl">
            <h3 className="font-semibold text-lg mb-2 text-card-foreground">
              Make It a Habit
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Daily check-ins help you notice patterns and insights. Build a
              practice of self-awareness, one reflection at a time.
            </p>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Your reflections are private and personal.
          </p>
        </div>
      </div>
    </div>
  );
}
