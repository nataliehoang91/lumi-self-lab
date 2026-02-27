"use client";

import { useState, useEffect, useRef } from "react";

const LOADING_VERSES = [
  {
    text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
    ref: "John 1:1",
  },
  {
    text: "Thy word is a lamp unto my feet, and a light unto my path.",
    ref: "Psalm 119:105",
  },
  {
    text: "For the word of God is alive and active, sharper than any double-edged sword.",
    ref: "Hebrews 4:12",
  },
  {
    text: "Every word of God is flawless; he is a shield to those who take refuge in him.",
    ref: "Proverbs 30:5",
  },
];

interface BibleLoaderProps {
  onComplete: () => void;
}

export function BibleLoader({ onComplete }: BibleLoaderProps) {
  const [phase, setPhase] = useState<"enter" | "typewrite" | "ref" | "progress" | "exit">("enter");
  const [displayedText, setDisplayedText] = useState("");
  const [showRef, setShowRef] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bookOpen, setBookOpen] = useState(false);
  const [particleCount] = useState(() => Array.from({ length: 18 }, (_, i) => i));
  const verseRef = useRef(LOADING_VERSES[Math.floor(Math.random() * LOADING_VERSES.length)]);
  const verse = verseRef.current;

  // Phase: enter — book appears
  useEffect(() => {
    const t = setTimeout(() => {
      setBookOpen(true);
      setTimeout(() => setPhase("typewrite"), 600);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  // Phase: typewrite — letter by letter
  useEffect(() => {
    if (phase !== "typewrite") return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(verse.text.slice(0, i));
      if (i >= verse.text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowRef(true);
          setPhase("progress");
        }, 300);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [phase, verse.text]);

  // Phase: progress bar
  useEffect(() => {
    if (phase !== "progress") return;
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 4 + 1.5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setPhase("exit");
        setTimeout(onComplete, 700);
      }
      setProgress(p);
    }, 45);
    return () => clearInterval(interval);
  }, [phase, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex min-h-screen min-w-full flex-col items-center justify-center overflow-hidden bg-body text-foreground transition-all duration-700 ${
        phase === "exit" ? "opacity-0 scale-[1.03]" : "opacity-100 scale-100"
      }`}
      aria-label="Loading Scripture Memory"
      role="status"
    >
      {/* Ambient glow — theme-aware */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 55%, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
          transition: "opacity 1s ease",
          opacity: bookOpen ? 1 : 0,
        }}
      />

      {/* Floating dust particles — theme-aware */}
      {particleCount.map((i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none bg-muted-foreground/20"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            left: `${10 + (i / 18) * 80}%`,
            top: `${20 + Math.sin(i * 1.3) * 30 + 30}%`,
            animation: `float-${i % 3} ${4 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6 max-w-xl w-full">
        {/* Animated open book SVG */}
        <div
          className="relative"
          style={{
            transform: bookOpen ? "translateY(0) scale(1)" : "translateY(20px) scale(0.85)",
            opacity: bookOpen ? 1 : 0,
            transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease",
          }}
        >
          <svg
            width="96"
            height="72"
            viewBox="0 0 96 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="stroke-border text-muted-foreground dark:stroke-foreground/50 dark:text-foreground/70"
          >
            {/* Spine */}
            <line
              x1="48"
              y1="8"
              x2="48"
              y2="68"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Left page */}
            <path
              d="M48 10 C35 8, 10 12, 6 16 L6 66 C10 62, 35 58, 48 60 Z"
              className="fill-muted/80 stroke-border dark:fill-foreground/25 dark:stroke-foreground/45"
              strokeWidth="1"
              style={{
                transformOrigin: "48px 35px",
                animation: bookOpen
                  ? "page-left 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                  : "none",
              }}
            />
            {/* Left page lines */}
            {[20, 28, 36, 44, 52].map((y, idx) => (
              <line
                key={idx}
                x1="14"
                y1={y}
                x2="42"
                y2={y + 1}
                className="stroke-muted-foreground/60 dark:stroke-foreground/55"
                strokeWidth="0.8"
                strokeLinecap="round"
                style={{
                  opacity: bookOpen ? 1 : 0,
                  transition: `opacity 0.4s ease ${0.8 + idx * 0.06}s`,
                }}
              />
            ))}
            {/* Right page */}
            <path
              d="M48 10 C61 8, 86 12, 90 16 L90 66 C86 62, 61 58, 48 60 Z"
              className="fill-muted/80 stroke-border dark:fill-foreground/25 dark:stroke-foreground/45"
              strokeWidth="1"
              style={{
                transformOrigin: "48px 35px",
                animation: bookOpen
                  ? "page-right 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                  : "none",
              }}
            />
            {/* Right page lines */}
            {[20, 28, 36, 44, 52].map((y, idx) => (
              <line
                key={idx}
                x1="54"
                y1={y + 1}
                x2="82"
                y2={y}
                className="stroke-muted-foreground/60 dark:stroke-foreground/55"
                strokeWidth="0.8"
                strokeLinecap="round"
                style={{
                  opacity: bookOpen ? 1 : 0,
                  transition: `opacity 0.4s ease ${0.8 + idx * 0.06}s`,
                }}
              />
            ))}
            {/* Glow at spine */}
            <ellipse cx="48" cy="38" rx="3" ry="24" className="fill-primary/10 dark:fill-primary/25" />
          </svg>

          {/* Soft radial beneath book */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full pointer-events-none bg-muted-foreground/20 dark:bg-foreground/25 blur-md"
            style={{
              opacity: bookOpen ? 1 : 0,
              transition: "opacity 1s ease 0.6s",
            }}
          />
        </div>

        {/* Brand name */}
        <div
          className="flex flex-col items-center gap-1 text-muted-foreground"
          style={{
            opacity: bookOpen ? 1 : 0,
            transform: bookOpen ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
          }}
        >
          <span className="font-serif tracking-[0.25em] uppercase text-sm">Scripture Memory</span>
        </div>

        {/* Verse typewriter */}
        <div
          className="text-center space-y-3 min-h-[80px] flex flex-col items-center justify-center text-foreground"
          style={{
            opacity: phase === "enter" ? 0 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          <p
            className="font-serif text-[1.05rem] leading-relaxed text-balance"
            style={{ lineHeight: "1.7" }}
          >
            {displayedText}
            {phase === "typewrite" && (
              <span
                className="inline-block w-0.5 h-5 ml-0.5 align-middle bg-primary animate-[blink_0.7s_step-end_infinite]"
                style={{ verticalAlign: "middle", marginBottom: "2px" }}
              />
            )}
          </p>
          <p
            className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground"
            style={{
              opacity: showRef ? 1 : 0,
              transform: showRef ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            — {verse.ref}
          </p>
        </div>

        {/* Progress */}
        <div
          className="w-full flex flex-col items-center gap-3"
          style={{
            opacity: phase === "progress" || phase === "exit" ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          <div className="w-full max-w-xs h-px rounded-full overflow-hidden bg-border">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-75 ease-linear shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-sans text-xs tabular-nums tracking-wider text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes page-left {
          0%   { transform: rotateY(0deg); }
          60%  { transform: rotateY(-8deg); }
          100% { transform: rotateY(-4deg); }
        }
        @keyframes page-right {
          0%   { transform: rotateY(0deg); }
          60%  { transform: rotateY(8deg); }
          100% { transform: rotateY(4deg); }
        }
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.15; }
          50%       { transform: translateY(-12px) translateX(4px); opacity: 0.4; }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
          50%       { transform: translateY(-8px) translateX(-6px); opacity: 0.5; }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.1; }
          50%       { transform: translateY(-16px) translateX(2px); opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
