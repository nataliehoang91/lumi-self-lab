import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WelcomeCTAs() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-16 justify-center">
      <Button
        size="lg"
        asChild
        className="px-8 py-6 text-lg rounded-2xl bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 border-0"
      >
        <Link href="/sign-up">Get Started</Link>
      </Button>
      <Button
        size="lg"
        variant="outline"
        asChild
        className="px-8 py-6 text-lg rounded-2xl bg-card/80 backdrop-blur border-2 border-border hover:bg-card transition-all hover:scale-105 active:scale-95"
      >
        <Link href="/sign-in">Sign In</Link>
      </Button>
    </div>
  );
}
