"use client";

import Link from "next/link";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
import type { NavLink } from "./types";
import { BibleLogo, MonotoneBibleLogo, WhiteBibleLogo } from "../../BibleLogo";

export interface LangPageFooterProps {
  tagline: string;
  copyright: string;
  navLinks: NavLink[];
}

export function LangPageFooter({ tagline, copyright, navLinks }: LangPageFooterProps) {
  const { bodyClass, subBodyClass } = useLearnFontClasses();

  return (
    <footer className="border-border/50 relative mt-12 border-t">
      {/* Subtle warm tint strip across top */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 left-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(0.80 0.12 35 / 0.35), oklch(0.70 0.15 270 / 0.2), transparent)",
        }}
      />

      <div className="mx-auto max-w-5xl px-4 pt-8 pb-5">
        {/* Main row */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Brand block */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              {/* Mini cross mark */}
              <WhiteBibleLogo />
              <div>
                <span className={`text-foreground font-serif font-semibold ${bodyClass}`}>
                  ScriptureSpace
                </span>
                <p
                  className={`text-muted-foreground max-w-[220px] text-xs leading-relaxed
                    ${subBodyClass}`}
                >
                  {tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Nav links — tighter, 2-col grid on small, row on md */}
          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-x-8 gap-y-1.5 md:flex md:gap-6"
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-muted-foreground hover:text-foreground text-xs
                leading-relaxed transition-colors ${subBodyClass}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div
          className="border-border/30 mt-6 flex items-center justify-between gap-4
            border-t pt-4"
        >
          <p className={`text-muted-foreground/50 text-xs ${subBodyClass}`}>
            &copy; {new Date().getFullYear()} Powered by SelfWithin. {copyright}
          </p>
          {/* Tiny accent dots using brand colors */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span
              className="size-3 rounded-full"
              style={{ background: "oklch(0.80 0.12 35 / 0.6)" }}
            />
            <span
              className="size-3 rounded-full"
              style={{ background: "oklch(0.70 0.15 270 / 0.5)" }}
            />
            <span
              className="size-3 rounded-full"
              style={{ background: "oklch(0.72 0.14 25 / 0.5)" }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
