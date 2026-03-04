import { LogoWithSmallerText } from "@/components/GeneralComponents/logo-with-smaller-text";

export function WelcomeHeader() {
  return (
    <header className="mb-16 text-center">
      <div className="mb-8 inline-flex items-center justify-center">
        <LogoWithSmallerText href="/" />
      </div>
      <h1
        className="text-foreground mb-4 text-4xl leading-tight font-bold text-balance
          md:text-5xl lg:text-6xl"
      >
        Understand Yourself
      </h1>
      <p
        className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed
          text-pretty md:text-xl"
      >
        Run personal experiments to discover your patterns, habits, and deeper insights.
      </p>
    </header>
  );
}
