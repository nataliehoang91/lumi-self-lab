"use client";

import Link from "next/link";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
import type { NavLink } from "./types";

export interface LangPageFooterProps {
  tagline: string;
  copyright: string;
  navLinks: NavLink[];
}

export function LangPageFooter({ tagline, copyright, navLinks }: LangPageFooterProps) {
  const { bodyClass, subBodyClass } = useLearnFontClasses();

  return (
    <footer className="border-t border-border/50 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <p className={`font-serif font-semibold text-foreground ${bodyClass}`}>SelfWithin</p>
          <p className={`text-muted-foreground mt-1 ${subBodyClass}`}>{tagline}</p>
        </div>
        <nav className="grid grid-cols-2 md:flex gap-x-10 gap-y-2">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-muted-foreground hover:text-foreground transition-colors ${subBodyClass}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-border/40 flex items-center justify-between">
        <p className={`text-muted-foreground/60 ${subBodyClass}`}>
          &copy; {new Date().getFullYear()} SelfWithin. {copyright}
        </p>
      </div>
    </footer>
  );
}
