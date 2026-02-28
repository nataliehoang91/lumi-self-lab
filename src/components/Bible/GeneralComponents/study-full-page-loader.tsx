"use client";

import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";

const STUDY_PHRASES = [
  { text: "Study to show thyself approved unto God.", ref: "2 Timothy 2:15" },
  { text: "Let the word of Christ dwell in you richly in all wisdom.", ref: "Colossians 3:16" },
  { text: "Open my eyes, that I may behold wondrous things out of your law.", ref: "Psalm 119:18" },
  {
    text: "For everything that was written in the past was written to teach us.",
    ref: "Romans 15:4",
  },
];

interface StudyFullPageLoaderProps {
  onComplete?: () => void;
  /** Visual style. "dark" matches current design; "light" is softer on bright backgrounds. */
  variant?: "light" | "dark";
}

export function StudyFullPageLoader({ onComplete, variant = "dark" }: StudyFullPageLoaderProps) {
  const [phase, setPhase] = useState<"enter" | "typewrite" | "ref" | "progress" | "exit">("enter");
  const [displayedText, setDisplayedText] = useState("");
  const [showRef, setShowRef] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [stack1, setStack1] = useState(false);
  const [stack2, setStack2] = useState(false);
  const [stack3, setStack3] = useState(false);
  const [penVisible, setPenVisible] = useState(false);
  const phraseRef = useRef(STUDY_PHRASES[Math.floor(Math.random() * STUDY_PHRASES.length)]);
  const phrase = phraseRef.current;

  const { theme } = useTheme();
  const isLight = theme === "light";

  const colors = {
    // Page background
    background: isLight ? "oklch(0.98 0.01 85)" : "oklch(0.13 0.01 85)",
    // Ambient radial glow
    ambient: isLight
      ? "radial-gradient(ellipse 55% 38% at 50% 52%, oklch(0.90 0.025 85 / 0.45) 0%, transparent 70%)"
      : "radial-gradient(ellipse 55% 38% at 50% 52%, oklch(0.26 0.025 85 / 0.4) 0%, transparent 70%)",
    // Type text + reference
    verseText: isLight ? "oklch(0.30 0.02 85)" : "oklch(0.82 0.015 85)",
    verseRef: isLight ? "oklch(0.42 0.015 85)" : "oklch(0.44 0.01 85)",
    // Cursor + progress primary
    accent: isLight ? "oklch(0.55 0.025 85)" : "oklch(0.60 0.02 85)",
    // Progress track + label
    progressTrack: isLight ? "oklch(0.90 0.01 85)" : "oklch(0.28 0.01 85)",
    progressLabel: isLight ? "oklch(0.40 0.015 85)" : "oklch(0.36 0.01 85)",
  } as const;

  // Stagger the book stack in
  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 100);
    const t2 = setTimeout(() => setStack1(true), 200);
    const t3 = setTimeout(() => setStack2(true), 380);
    const t4 = setTimeout(() => setStack3(true), 520);
    const t5 = setTimeout(() => {
      setPenVisible(true);
      setTimeout(() => setPhase("typewrite"), 500);
    }, 700);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  // Typewrite
  useEffect(() => {
    if (phase !== "typewrite") return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(phrase.text.slice(0, i));
      if (i >= phrase.text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowRef(true);
          setPhase("progress");
        }, 300);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [phase, phrase.text]);

  // Progress
  useEffect(() => {
    if (phase !== "progress") return;
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 4 + 1.5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setPhase("exit");
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 650);
      }
      setProgress(p);
    }, 45);
    return () => clearInterval(interval);
  }, [phase, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-all duration-650`}
      style={{
        background: colors.background,
        opacity: phase === "exit" ? 0 : 1,
        transform: phase === "exit" ? "scale(1.025)" : "scale(1)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
      }}
      aria-label="Loading Study"
      role="status"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: colors.ambient,
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6 max-w-lg w-full">
        {/* Stacked books icon */}
        <div
          className="relative"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          {/* Shadow beneath stack */}
          <div
            style={{
              position: "absolute",
              bottom: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "90px",
              height: "10px",
              background: "oklch(0.65 0.03 85 / 0.12)",
              filter: "blur(10px)",
              borderRadius: "50%",
              opacity: stack1 ? 1 : 0,
              transition: "opacity 0.6s ease 0.4s",
            }}
          />

          <svg
            width="108"
            height="96"
            viewBox="0 0 108 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Book 1 — bottom, widest, slight tilt left */}
            <g
              style={{
                transform: stack1
                  ? "translateY(0px) rotate(-3deg)"
                  : "translateY(24px) rotate(-3deg)",
                opacity: stack1 ? 1 : 0,
                transition: "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
                transformOrigin: "54px 78px",
              }}
            >
              {/* Spine */}
              <rect x="10" y="64" width="6" height="22" rx="1" fill="oklch(0.38 0.015 85)" />
              {/* Cover */}
              <rect x="16" y="64" width="76" height="22" rx="2" fill="oklch(0.30 0.012 85)" />
              {/* Pages edge */}
              <rect x="88" y="65" width="4" height="20" rx="1" fill="oklch(0.48 0.018 85)" />
              {/* Horizontal lines (pages) */}
              <line
                x1="17"
                y1="69"
                x2="87"
                y2="69"
                stroke="oklch(0.42 0.012 85)"
                strokeWidth="0.6"
              />
              <line
                x1="17"
                y1="73"
                x2="87"
                y2="73"
                stroke="oklch(0.42 0.012 85)"
                strokeWidth="0.6"
              />
              <line
                x1="17"
                y1="77"
                x2="87"
                y2="77"
                stroke="oklch(0.42 0.012 85)"
                strokeWidth="0.6"
              />
            </g>

            {/* Book 2 — middle, slight tilt right */}
            <g
              style={{
                transform: stack2
                  ? "translateY(0px) rotate(2deg)"
                  : "translateY(20px) rotate(2deg)",
                opacity: stack2 ? 1 : 0,
                transition:
                  "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s, opacity 0.4s ease 0.08s",
                transformOrigin: "54px 55px",
              }}
            >
              <rect x="14" y="44" width="6" height="22" rx="1" fill="oklch(0.34 0.013 85)" />
              <rect x="20" y="44" width="70" height="22" rx="2" fill="oklch(0.26 0.01 85)" />
              <rect x="86" y="45" width="4" height="20" rx="1" fill="oklch(0.44 0.016 85)" />
              <line
                x1="21"
                y1="49"
                x2="85"
                y2="49"
                stroke="oklch(0.38 0.01 85)"
                strokeWidth="0.6"
              />
              <line
                x1="21"
                y1="53"
                x2="85"
                y2="53"
                stroke="oklch(0.38 0.01 85)"
                strokeWidth="0.6"
              />
              <line
                x1="21"
                y1="57"
                x2="85"
                y2="57"
                stroke="oklch(0.38 0.01 85)"
                strokeWidth="0.6"
              />
              {/* Bookmark ribbon */}
              <path
                d="M74 44 L74 36 L79 39 L84 36 L84 44 Z"
                fill="oklch(0.55 0.02 50)"
                style={{
                  opacity: stack2 ? 0.8 : 0,
                  transition: "opacity 0.4s ease 0.5s",
                }}
              />
            </g>

            {/* Book 3 — top, no tilt, slightly narrower */}
            <g
              style={{
                transform: stack3
                  ? "translateY(0px) rotate(-1deg)"
                  : "translateY(16px) rotate(-1deg)",
                opacity: stack3 ? 1 : 0,
                transition:
                  "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.16s, opacity 0.4s ease 0.16s",
                transformOrigin: "54px 33px",
              }}
            >
              <rect x="18" y="22" width="6" height="22" rx="1" fill="oklch(0.42 0.016 85)" />
              <rect x="24" y="22" width="62" height="22" rx="2" fill="oklch(0.32 0.013 85)" />
              <rect x="82" y="23" width="4" height="20" rx="1" fill="oklch(0.50 0.018 85)" />
              <line
                x1="25"
                y1="27"
                x2="81"
                y2="27"
                stroke="oklch(0.44 0.012 85)"
                strokeWidth="0.6"
              />
              <line
                x1="25"
                y1="31"
                x2="81"
                y2="31"
                stroke="oklch(0.44 0.012 85)"
                strokeWidth="0.6"
              />
              <line
                x1="25"
                y1="35"
                x2="81"
                y2="35"
                stroke="oklch(0.44 0.012 85)"
                strokeWidth="0.6"
              />
            </g>

            {/* Pen / pencil on top — animates in last */}
            <g
              style={{
                transform: penVisible
                  ? "translate(0px, 0px) rotate(-35deg)"
                  : "translate(20px, -10px) rotate(-35deg)",
                opacity: penVisible ? 1 : 0,
                transition:
                  "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s, opacity 0.45s ease 0.1s",
                transformOrigin: "70px 22px",
              }}
            >
              {/* Pen body */}
              <rect x="55" y="4" width="6" height="28" rx="1.5" fill="oklch(0.60 0.02 85)" />
              {/* Pen nib */}
              <path d="M55 32 L58 40 L61 32 Z" fill="oklch(0.70 0.025 85)" />
              {/* Pen clip */}
              <rect x="59.5" y="6" width="1.2" height="20" rx="0.6" fill="oklch(0.48 0.015 85)" />
              {/* Pen top cap */}
              <rect x="55" y="3" width="6" height="3" rx="1.5" fill="oklch(0.50 0.016 85)" />
            </g>
          </svg>
        </div>

        {/* Brand label */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s",
          }}
          className="flex flex-col items-center gap-1"
        >
          <span
            className="font-serif tracking-widest uppercase text-xs"
            style={{ color: "oklch(0.50 0.015 85)", letterSpacing: "0.25em" }}
          >
            Scripture Memory
          </span>
          <span
            className="font-sans text-xs"
            style={{ color: "oklch(0.35 0.01 85)", letterSpacing: "0.15em" }}
          >
            STUDY
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
              color: colors.verseText,
              fontSize: "1rem",
              lineHeight: "1.75",
            }}
          >
            {displayedText}
            {phase === "typewrite" && (
              <span
                className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                style={{
                  background: colors.accent,
                  animation: "blink-cursor 0.7s step-end infinite",
                  verticalAlign: "middle",
                  marginBottom: "1px",
                }}
              />
            )}
          </p>
          <p
            className="font-sans text-xs tracking-widest"
            style={{
              color: colors.verseRef,
              letterSpacing: "0.2em",
              opacity: showRef ? 1 : 0,
              transform: showRef ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            — {phrase.ref}
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="w-full flex flex-col items-center gap-3"
          style={{
            opacity: phase === "progress" || phase === "exit" ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          <div
            className="w-full max-w-xs rounded-full overflow-hidden"
            style={{ height: "1px", background: colors.progressTrack }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: colors.accent,
                transition: "width 0.08s linear",
                boxShadow: "0 0 6px oklch(0.68 0.022 85 / 0.55)",
                borderRadius: "9999px",
              }}
            />
          </div>
          <span
            className="font-sans text-xs tabular-nums"
            style={{ color: colors.progressLabel, letterSpacing: "0.12em" }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
