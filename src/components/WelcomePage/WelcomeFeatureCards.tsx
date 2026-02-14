import { Card } from "@/components/ui/card";
import { PrettyIcon } from "@/components/ui/pretty-icon";
import { cn } from "@/lib/utils";
import { Zap, Moon, Heart } from "lucide-react";

const features = [
  {
    variant: "second" as const,
    icon: Zap,
    title: "Design Experiments",
    description: "Create structured experiments to test your habits and behaviors.",
  },
  {
    variant: "coral" as const,
    icon: Moon,
    title: "Daily Reflections",
    description: "Check in each day and capture your observations and feelings.",
  },
  {
    variant: "sky-blue" as const,
    icon: Heart,
    title: "Find Patterns",
    description: "Discover meaningful insights about yourself through data.",
  },
];

const cardVariantClasses = {
  second: "border-second/25 hover:border-second/40",
  coral: "border-coral/25 hover:border-coral/40",
  "sky-blue": "border-sky-blue/25 hover:border-sky-blue/40 ",
};

export function WelcomeFeatureCards() {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-16">
      {features.map(({ variant, icon: Icon, title, description }) => (
        <Card
          key={variant}
          className={cn(
            "p-6 bg-white/90 dark:bg-card border-2 rounded-2xl hover:shadow-lg transition-all",
            cardVariantClasses[variant]
          )}
        >
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <PrettyIcon variant={variant} size="sm" className="mb-4">
              <Icon strokeWidth={1.5} />
            </PrettyIcon>
            <h3 className="font-semibold mb-2 text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
