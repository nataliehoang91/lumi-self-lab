"use client";

import { useState } from "react";
import Link from "next/link";
import { IndividualContainer } from "@/components/GeneralComponents/individual-container";
import { HelpCircle, Lightbulb, Target, ArrowRight, Compass } from "lucide-react";

export default function OnboardingPage() {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const options = [
    {
      id: "dont-know",
      icon: HelpCircle,
      title: "I'm not sure what to track",
      description: "Let me guide you with a few questions to discover what matters most",
      href: "/onboarding/guided",
      gradient:
        "from-violet-100 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/20",
      iconBg: "bg-violet-500",
    },
    {
      id: "have-idea",
      icon: Lightbulb,
      title: "I have something in mind",
      description: "Create a custom experiment from scratch with full flexibility",
      href: "/experiments/create",
      gradient: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
      iconBg: "bg-amber-500",
    },
    {
      id: "browse",
      icon: Target,
      title: "Show me templates",
      description: "Browse proven experiments from your organisation's library",
      href: "/templates",
      gradient: "from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20",
      iconBg: "bg-sky-500",
    },
  ];

  return (
    <IndividualContainer>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div
            className="from-primary/20 to-violet/20 mb-6 inline-flex h-16 w-16
              items-center justify-center rounded-full bg-gradient-to-br"
          >
            <Compass className="text-primary h-8 w-8" />
          </div>
          <h1
            className="text-foreground mb-4 text-4xl font-semibold text-balance
              md:text-5xl"
          >
            What would you like to explore?
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
            Self-experiments help you understand yourself better. There&apos;s no right or
            wrong way to start.
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
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br p-8
                  md:p-10 ${option.gradient} border-2 border-transparent transition-all
                  duration-300 ease-out ${
                    isHovered
                      ? "border-primary/30 shadow-primary/10 scale-[1.02] shadow-xl"
                      : "shadow-lg shadow-black/5"
                  } `}
                >
                  <div className="flex items-start gap-6">
                    <div
                      className={`h-14 w-14 flex-shrink-0 rounded-2xl ${option.iconBg}
                      flex items-center justify-center transition-transform duration-300
                      ${isHovered ? "scale-110 rotate-3" : ""} `}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-foreground mb-2 text-xl font-medium md:text-2xl">
                        {option.title}
                      </h3>
                      <p className="text-muted-foreground">{option.description}</p>
                    </div>

                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center
                      rounded-full bg-white/50 transition-all duration-300
                      dark:bg-white/10
                      ${isHovered ? "bg-primary text-primary-foreground translate-x-1" : ""}
                      `}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">
            You can always change your mind later. This is your journey.
          </p>
        </div>
      </div>
    </IndividualContainer>
  );
}
