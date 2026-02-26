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
  const verseRef = useRef(
    LOADING_VERSES[Math.floor(Math.random() * LOADING_VERSES.length)],
  );
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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ${
        phase === "exit" ? "opacity-0 scale-[1.03]" : "opacity-100 scale-100"
      }`}
      style={{ background: "oklch(0.13 0.01 85)" }}
      aria-label="Loading Scripture Memory"
      role="status"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 55%, oklch(0.28 0.03 85 / 0.35) 0%, transparent 70%)",
          transition: "opacity 1s ease",
          opacity: bookOpen ? 1 : 0,
        }}
      />

      {/* Floating dust particles */}
      {particleCount.map((i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            background: `oklch(0.75 0.02 85 / ${Math.random() * 0.3 + 0.1})`,
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
            transition:
              "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease",
          }}
        >
          <svg
            width="96"
            height="72"
            viewBox="0 0 96 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Spine */}
            <line
              x1="48"
              y1="8"
              x2="48"
              y2="68"
              stroke="oklch(0.65 0.03 85)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Left page */}
            <path
              d="M48 10 C35 8, 10 12, 6 16 L6 66 C10 62, 35 58, 48 60 Z"
              fill="oklch(0.22 0.012 85)"
              stroke="oklch(0.5 0.02 85)"
              strokeWidth="1"
              className="book-page-left"
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
                stroke="oklch(0.45 0.015 85)"
                strokeWidth="0.8"
                strokeLinecap="round"
                style={{
                  opacity: bookOpen ? 0.6 : 0,
                  transition: `opacity 0.4s ease ${0.8 + idx * 0.06}s`,
                }}
              />
            ))}
            {/* Right page */}
            <path
              d="M48 10 C61 8, 86 12, 90 16 L90 66 C86 62, 61 58, 48 60 Z"
              fill="oklch(0.22 0.012 85)"
              stroke="oklch(0.5 0.02 85)"
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
                stroke="oklch(0.45 0.015 85)"
                strokeWidth="0.8"
                strokeLinecap="round"
                style={{
                  opacity: bookOpen ? 0.6 : 0,
                  transition: `opacity 0.4s ease ${0.8 + idx * 0.06}s`,
                }}
              />
            ))}
            {/* Glow at spine */}
            <ellipse
              cx="48"
              cy="38"
              rx="3"
              ry="24"
              fill="oklch(0.78 0.04 85 / 0.12)"
            />
          </svg>

          {/* Soft radial beneath book */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
            style={{
              width: "80px",
              height: "12px",
              background: "oklch(0.65 0.03 85 / 0.18)",
              filter: "blur(8px)",
              opacity: bookOpen ? 1 : 0,
              transition: "opacity 1s ease 0.6s",
            }}
          />
        </div>

        {/* Brand name */}
        <div
          className="flex flex-col items-center gap-1"
          style={{
            opacity: bookOpen ? 1 : 0,
            transform: bookOpen ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
          }}
        >
          <span
            className="font-serif tracking-widest uppercase text-xs"
            style={{ color: "oklch(0.5 0.015 85)", letterSpacing: "0.25em" }}
          >
            Scripture Memory
          </span>
        </div>

        {/* Verse typewriter */}
        <div
          className="text-center space-y-3 min-h-[80px] flex flex-col items-center justify-center"
          style={{
            opacity: phase === "enter" ? 0 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          <p
            className="font-serif leading-relaxed text-balance"
            style={{
              color: "oklch(0.82 0.015 85)",
              fontSize: "1.05rem",
              lineHeight: "1.7",
            }}
          >
            {displayedText}
            {phase === "typewrite" && (
              <span
                className="inline-block w-0.5 h-5 ml-0.5 align-middle"
                style={{
                  background: "oklch(0.65 0.02 85)",
                  animation: "blink 0.7s step-end infinite",
                  verticalAlign: "middle",
                  marginBottom: "2px",
                }}
              />
            )}
          </p>
          <p
            className="font-sans text-xs tracking-widest uppercase"
            style={{
              color: "oklch(0.45 0.01 85)",
              letterSpacing: "0.2em",
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
          <div
            className="w-full max-w-xs rounded-full overflow-hidden"
            style={{
              height: "1px",
              background: "oklch(0.3 0.01 85)",
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "oklch(0.72 0.025 85)",
                transition: "width 0.08s linear",
                boxShadow: "0 0 8px oklch(0.72 0.025 85 / 0.6)",
              }}
            />
          </div>
          <span
            className="font-sans text-xs tabular-nums"
            style={{ color: "oklch(0.38 0.01 85)", letterSpacing: "0.12em" }}
          >
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

