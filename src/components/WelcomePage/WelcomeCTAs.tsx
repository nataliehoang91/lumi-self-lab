import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WelcomeCTAs() {
  return (
    <div className="mb-16 flex flex-col justify-center gap-3 sm:flex-row">
      <Button
        size="lg"
        asChild
        className="from-primary to-primary/90 text-primary-foreground rounded-2xl border-0
          bg-gradient-to-b px-8 py-6 text-lg shadow-lg transition-all hover:scale-105
          hover:shadow-xl active:scale-95"
      >
        <Link href="/sign-up">Get Started</Link>
      </Button>
      <Button
        size="lg"
        variant="outline"
        asChild
        className="bg-card/80 border-border hover:bg-card rounded-2xl border-2 px-8 py-6
          text-lg backdrop-blur transition-all hover:scale-105 active:scale-95"
      >
        <Link href="/sign-in">Sign In</Link>
      </Button>
    </div>
  );
}
