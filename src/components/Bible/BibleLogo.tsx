"use client";

import Link from "next/link";

export const WhiteBibleLogo = () => {
  return (
    <div className="relative flex h-7 w-6 items-center justify-center sm:h-8 sm:w-7">
      {/* Soft halo behind cross */}
      <div className="bible-logo-halo pointer-events-none absolute inset-0 rounded-full" />
      {/* Cross — same gradient language as landing loader */}
      <svg viewBox="0 0 52 66" aria-hidden="true" className="relative h-full w-full">
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
        <rect
          x="0"
          y="18"
          width="52"
          height="8"
          rx="4"
          fill="url(#bibleCrossHighlight)"
        />
        {/* Inner shimmer highlight */}
        <rect
          x="24"
          y="0"
          width="3"
          height="66"
          rx="2"
          fill="oklch(0.99 0.04 80 / 0.28)"
        />
        <rect
          x="0"
          y="20"
          width="52"
          height="3"
          rx="2"
          fill="oklch(0.99 0.04 80 / 0.28)"
        />
      </svg>
    </div>
  );
};

export const BlackBibleLogo = () => {
  return (
    <>
      {/* ── Inner depth — subtle bottom-right shadow for pressed feel ── */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-xl"
        style={{
          background: `
            radial-gradient(
              ellipse at 68% 78%,
              oklch(0.55 0 0 / 0.14) 0%,
              transparent 60%
            )
          `,
        }}
      />

      {/* ── Halo disc behind cross ── */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full"
        style={{
          width: "62%",
          height: "62%",
          background: `radial-gradient(
            circle,
            oklch(1 0 0 / 0.6) 0%,
            oklch(0.94 0 0 / 0.35) 45%,
            transparent 80%
          )`,
          filter: "blur(4px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ── Cross SVG — near-black, crisp, high contrast ── */}
      <span className="relative z-10 h-[62%] w-[52%]">
        <svg
          viewBox="0 0 52 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="h-full w-full"
          style={{ shapeRendering: "geometricPrecision" }}
        >
          <defs>
            {/* Vertical: near-black for strong contrast */}
            <linearGradient
              id="crossMainB"
              x1="26"
              y1="0"
              x2="26"
              y2="68"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="oklch(0.28 0 0)" />
              <stop offset="45%" stopColor="oklch(0.12 0 0)" />
              <stop offset="100%" stopColor="oklch(0.24 0 0)" />
            </linearGradient>

            {/* Horizontal: same near-black tones */}
            <linearGradient
              id="crossHB"
              x1="0"
              y1="20"
              x2="52"
              y2="20"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="oklch(0.26 0 0)" />
              <stop offset="50%" stopColor="oklch(0.10 0 0)" />
              <stop offset="100%" stopColor="oklch(0.26 0 0)" />
            </linearGradient>

            {/* Crisp offset shadow only — no blur for sharp edges */}
            <filter id="crossShadowB" x="-30%" y="-10%" width="160%" height="130%">
              <feDropShadow
                dx="0"
                dy="1"
                stdDeviation="0"
                floodColor="oklch(0.08 0 0)"
                floodOpacity="0.4"
              />
            </filter>

            {/* Specular highlight — subtle 3-D edge */}
            <linearGradient
              id="crossShineB"
              x1="22"
              y1="0"
              x2="30"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="oklch(1 0 0 / 0)" />
              <stop offset="40%" stopColor="oklch(1 0 0 / 0.22)" />
              <stop offset="100%" stopColor="oklch(1 0 0 / 0)" />
            </linearGradient>
          </defs>

          {/* Vertical beam */}
          <rect
            x="22"
            y="0"
            width="8"
            height="68"
            rx="4"
            fill="url(#crossMainB)"
            filter="url(#crossShadowB)"
          />
          {/* Horizontal beam */}
          <rect
            x="0"
            y="18"
            width="52"
            height="8"
            rx="4"
            fill="url(#crossHB)"
            filter="url(#crossShadowB)"
          />

          {/* Specular highlight — 3-D raised edge */}
          <rect x="23" y="0" width="3" height="68" rx="2" fill="url(#crossShineB)" />
          <rect x="0" y="19" width="52" height="3" rx="2" fill="oklch(1 0 0 / 0.14)" />
        </svg>
      </span>

      {/* ── Hover: primary ring + soft glow ── */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0
          transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `
            0 0 0 1.5px var(--primary),
            0 0 16px 4px oklch(0.18 0 0 / 0.15),
            0 0 32px 8px oklch(0.18 0 0 / 0.08)
          `,
        }}
      />
    </>
  );
};

export function BibleLogo() {
  return (
    <Link
      href="/bible"
      className="bible-logo-shell logo-brand-colors border-primary-light flex size-8
        shrink-0 items-center justify-center overflow-hidden rounded-xl border
        text-stone-800 shadow-sm sm:size-10"
      aria-label="Scripture·Space home"
    >
      <WhiteBibleLogo />
    </Link>
  );
}

export function MonotoneBibleLogo() {
  return (
    <Link
      href="/bible"
      aria-label="Scripture·Space home"
      className="group relative flex size-8 shrink-0 items-center justify-center
        overflow-visible rounded-xl border-none sm:size-10"
    >
      {/* ── Outer ambient glow ring ── */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl"
      />

      {/* ── Badge background — reuse original diagonal brand gradient ── */}
      <span
        aria-hidden="true"
        className="from-primary-light via-coral hover:border-primary absolute inset-0
          rounded-xl bg-linear-to-br to-yellow-200/50"
      />
      <BlackBibleLogo />
    </Link>
  );
}
