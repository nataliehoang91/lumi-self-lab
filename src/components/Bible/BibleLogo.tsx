"use client";

import Link from "next/link";

export function BibleLogo() {
  return (
    <Link
      href="/bible"
      className="bible-logo-shell logo-brand-colors size-8 sm:size-10 rounded-xl border border-primary-light shadow-sm text-stone-800 flex items-center justify-center shrink-0 overflow-hidden"
      aria-label="Scripture Memory home"
    >
      <div className="relative w-6 h-7 sm:w-7 sm:h-8 flex items-center justify-center">
        {/* Soft halo behind cross */}
        <div className="absolute inset-0 rounded-full pointer-events-none bible-logo-halo" />
        {/* Cross — same gradient language as landing loader */}
        <svg viewBox="0 0 52 66" aria-hidden="true" className="relative w-full h-full">
          <defs>
            <linearGradient
              id="bibleCrossGrad"
              x1="26"
              y1="0"
              x2="26"
              y2="66"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="oklch(0.9 0.08 34)" />
              <stop offset="50%" stopColor="oklch(0.75 0.16 30)" />
              <stop offset="100%" stopColor="oklch(0.88 0.16 70)" />
            </linearGradient>
            <linearGradient
              id="bibleCrossHighlight"
              x1="0"
              y1="18"
              x2="52"
              y2="18"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="oklch(0.9 0.08 34)" />
              <stop offset="50%" stopColor="oklch(0.75 0.16 30)" />
              <stop offset="100%" stopColor="oklch(0.88 0.16 70)" />
            </linearGradient>
          </defs>
          {/* Vertical beam */}
          <rect x="22" y="0" width="8" height="66" rx="4" fill="url(#bibleCrossGrad)" />
          {/* Horizontal beam */}
          <rect x="0" y="18" width="52" height="8" rx="4" fill="url(#bibleCrossHighlight)" />
          {/* Inner shimmer highlight */}
          <rect x="24" y="0" width="3" height="66" rx="2" fill="oklch(0.99 0.04 80 / 0.28)" />
          <rect x="0" y="20" width="52" height="3" rx="2" fill="oklch(0.99 0.04 80 / 0.28)" />
        </svg>
      </div>
    </Link>
  );
}
