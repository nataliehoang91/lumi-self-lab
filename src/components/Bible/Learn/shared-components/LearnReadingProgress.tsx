"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SIZE = 80;
const R = 30;
const C = 2 * Math.PI * R; // ≈ 188.5

export function LearnReadingProgress() {
  const pathname = usePathname();
  const [pct, setPct] = useState(0);
  const [mounted, setMounted] = useState(false);

  const parts = pathname?.split("/") ?? [];
  const isLearnModule =
    (parts[3] === "learn" && parts[4] != null && parts[4] !== "") ||
    parts[3] === "book-overviews" ||
    parts[3] === "topics" ||
    parts[3] === "topics-timeline";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLearnModule) { setPct(0); return; }
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLearnModule, pathname]);

  if (!isLearnModule || !mounted) return null;

  const offset = C * (1 - pct / 100);
  const done = pct >= 99.5;

  return (
    <div
      className="fixed bottom-8 left-8 z-40 flex items-center justify-center"
      title={`${Math.round(pct)}% read`}
      aria-label={`Reading progress: ${Math.round(pct)}%`}
    >
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, color-mix(in oklch, var(--second) 20%, transparent) 0%, transparent 70%)`,
          opacity: pct > 5 ? 1 : 0,
        }}
      />

      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          strokeWidth="5"
          className="stroke-border/60"
        />
        {/* Progress arc */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className="stroke-second transition-[stroke-dashoffset] duration-200 ease-out"
          style={{
            strokeDasharray: C,
            strokeDashoffset: offset,
            filter: pct > 10 ? "drop-shadow(0 0 5px color-mix(in oklch, var(--second) 50%, transparent))" : "none",
          }}
        />
        {/* Completion fill */}
        {done && (
          <circle cx={SIZE / 2} cy={SIZE / 2} r={10} className="fill-second" />
        )}
      </svg>

      {/* Percentage label */}
      {!done && (
        <span
          className="text-foreground/70 absolute font-mono font-semibold tabular-nums"
          style={{ fontSize: "14px" }}
        >
          {pct < 2 ? "" : `${Math.round(pct)}%`}
        </span>
      )}
      {done && (
        <svg
          width="22" height="22" viewBox="0 0 12 12"
          className="fill-white absolute"
        >
          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      )}
    </div>
  );
}
