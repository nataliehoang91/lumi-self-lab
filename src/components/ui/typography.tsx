import type React from "react";
import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  tag?: HeadingLevel;
  className?: string;
  children: React.ReactNode;
}

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children: React.ReactNode;
}

interface AccentTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  children: React.ReactNode;
}

// Headline - Medium weight Figtree
export function Heading({ tag = "h2", className, children, ...props }: HeadingProps) {
  const HeadingTag = tag;

  const defaultStyles = {
    h1: "text-4xl lg:text-5xl xl:text-6xl",
    h2: "text-3xl lg:text-4xl xl:text-5xl",
    h3: "text-2xl lg:text-3xl",
    h4: "text-xl lg:text-2xl",
    h5: "text-lg lg:text-xl",
    h6: "text-base lg:text-lg",
  };

  return (
    <HeadingTag
      className={cn("font-heading tracking-tight leading-tight", defaultStyles[tag], className)}
      {...props}
    >
      {children}
    </HeadingTag>
  );
}

// Paragraph - Regular weight Figtree
export function Text({ className, children, ...props }: TextProps) {
  return (
    <p className={cn("font-body leading-relaxed text-base", className)} {...props}>
      {children}
    </p>
  );
}

// Accent - Semibold weight Figtree (for links, buttons, emphasis)
export function AccentText({ className, children, ...props }: AccentTextProps) {
  return (
    <span className={cn("font-accent", className)} {...props}>
      {children}
    </span>
  );
}

// Link component following the "Read more >" pattern
export function AccentLink({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLAnchorElement> & { href?: string }) {
  return (
    <a
      className={cn("font-accent text-primary hover:text-primary/80 transition-colors", className)}
      {...props}
    >
      {children}
    </a>
  );
}
