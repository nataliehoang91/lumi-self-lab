"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Lightbulb,
  Target,
  ArrowRight,
  Compass,
} from "lucide-react";

export default function OnboardingPage() {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const options = [
    {
      id: "dont-know",
      icon: HelpCircle,
      title: "I'm not sure what to track",
      description:
        "Let me guide you with a few questions to discover what matters most",
      href: "/onboarding/guided",
      gradient:
        "from-violet-100 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/20",
      iconBg: "bg-violet-500",
    },
    {
      id: "have-idea",
      icon: Lightbulb,
      title: "I have something in mind",
      description:
        "Create a custom experiment from scratch with full flexibility",
      href: "/create",
      gradient:
        "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
      iconBg: "bg-amber-500",
    },
    {
      id: "browse",
      icon: Target,
      title: "Show me templates",
      description: "Browse proven experiments from your organisation's library",
      href: "/templates",
      gradient:
        "from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20",
      iconBg: "bg-sky-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-violet-50 dark:from-background dark:via-background dark:to-violet-950/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-violet/20 mb-6">
            <Compass className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4 text-balance">
            What would you like to explore?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Self-experiments help you understand yourself better. There's no
            right or wrong way to start.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid gap-6 md:gap-8">
          {options.map((option) => {
            const Icon = option.icon;
            const isHovered = hoveredOption === option.id;

            return (
              <Link
                key={option.id}
                href={option.href}
                onMouseEnter={() => setHoveredOption(option.id)}
                onMouseLeave={() => setHoveredOption(null)}
                className="group block"
              >
                <div
                  className={`
                  relative overflow-hidden rounded-3xl p-8 md:p-10
                  bg-gradient-to-br ${option.gradient}
                  border-2 border-transparent
                  transition-all duration-300 ease-out
                  ${
                    isHovered
                      ? "border-primary/30 shadow-xl shadow-primary/10 scale-[1.02]"
                      : "shadow-lg shadow-black/5"
                  }
                `}
                >
                  <div className="flex items-start gap-6">
                    <div
                      className={`
                      flex-shrink-0 w-14 h-14 rounded-2xl ${option.iconBg}
                      flex items-center justify-center
                      transition-transform duration-300
                      ${isHovered ? "scale-110 rotate-3" : ""}
                    `}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-xl md:text-2xl font-medium text-foreground mb-2">
                        {option.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {option.description}
                      </p>
                    </div>

                    <div
                      className={`
                      flex-shrink-0 w-10 h-10 rounded-full bg-white/50 dark:bg-white/10
                      flex items-center justify-center
                      transition-all duration-300
                      ${
                        isHovered
                          ? "bg-primary text-primary-foreground translate-x-1"
                          : ""
                      }
                    `}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            You can always change your mind later. This is your journey.
          </p>
        </div>
      </div>
    </div>
  );
}
