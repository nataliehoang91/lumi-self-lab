import { LogoWithSmallerText } from "@/components/GeneralComponents/logo-with-smaller-text";

export function WelcomeHeader() {
  return (
    <header className="mb-16 text-center">
      <div className="inline-flex items-center justify-center mb-8">
        <LogoWithSmallerText href="/" />
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance text-foreground leading-tight">
        Understand Yourself
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
        Run personal experiments to discover your patterns, habits, and deeper insights.
      </p>
    </header>
  );
}
