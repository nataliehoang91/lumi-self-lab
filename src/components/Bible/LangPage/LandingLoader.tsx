"use client";

import { useState, useEffect, useRef } from "react";

const WORDS = ["Know.", "Understand.", "Reflect.", "Grow."];

const WELCOME_VERSE = {
  text: "Come to me, all you who are weary and burdened, and I will give you rest.",
  ref: "Matthew 11:28",
};

export interface LandingLoaderProps {
  onComplete: () => void;
}

export function LandingLoader({ onComplete }: LandingLoaderProps) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"bloom" | "words" | "verse" | "exit">("bloom");
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(false);
  const [verseVisible, setVerseVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bloomReady, setBloomReady] = useState(false);

  const particleData = useRef<
    Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      dur: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    particleData.current = Array.from({ length: 28 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.8 + 0.6,
      opacity: Math.random() * 0.2 + 0.04,
      dur: Math.random() * 7 + 5,
      delay: Math.random() * 5,
    }));
    setMounted(true);
  }, []);

  // Phase: bloom
  useEffect(() => {
    const t1 = setTimeout(() => setBloomReady(true), 200);
    const t2 = setTimeout(() => setPhase("words"), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Phase: words
  useEffect(() => {
    if (phase !== "words") return;
    let idx = 0;
    const show = () => {
      setWordIndex(idx);
      setWordVisible(true);
      setTimeout(() => {
        setWordVisible(false);
        setTimeout(() => {
          idx++;
          if (idx < WORDS.length) show();
          else {
            setPhase("verse");
            setTimeout(() => setVerseVisible(true), 100);
          }
        }, 340);
      }, 720);
    };
    const t = setTimeout(show, 100);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase: verse + progress
  useEffect(() => {
    if (phase !== "verse") return;
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 3 + 1.5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setPhase("exit");
          setTimeout(onComplete, 900);
        }, 700);
      }
      setProgress(p);
    }, 40);
    return () => clearInterval(interval);
  }, [phase, onComplete]);

  if (!mounted) return null;

  return (
    <div
      className={`bg-body landing-loader-bg fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden transition-all duration-[900ms] ease-in-out ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-label="SelfWithin loading"
    >
      {/* Dust particles — theme-aware (light: foreground; dark: peach/coral) */}
      {particleData.current.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: "var(--loader-particle)",
            opacity: p.opacity,
            animation: `sw-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Central radial bloom — tighter around cross so outer area is softer */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-[1600ms]"
        style={{
          background: bloomReady
            ? `radial-gradient(ellipse 46% 32% at 50% 50%, var(--loader-bloom1) 0%, var(--loader-bloom2) 55%, transparent 72%)`
            : "radial-gradient(ellipse 0% 0% at 50% 50%, transparent 0%, transparent 100%)",
        }}
      />

      {/* Outer halo — smaller, very soft so it blends into bg */}
      <div
        className="absolute pointer-events-none rounded-full transition-all duration-[2200ms]"
        style={{
          width: bloomReady ? "420px" : "0px",
          height: bloomReady ? "420px" : "0px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, oklch(0.96 0.1 70 / 0.55) 0%, oklch(0.97 0.05 80 / 0.18) 40%, oklch(0.99 0.02 90 / 0.04) 70%, transparent 85%)",
          filter: "blur(60px)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6 max-w-lg w-full">
        {/* Brand wordmark */}
        <div
          className="flex flex-col items-center gap-2.5"
          style={{
            opacity: bloomReady ? 1 : 0,
            transform: bloomReady ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 1s ease 0.35s, transform 1s ease 0.35s",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="h-px w-10" style={{ background: "var(--loader-hairline)" }} />
            <span
              className="font-serif tracking-[0.38em] uppercase text-xs"
              style={{ color: "var(--loader-wordmark)" }}
            >
              SelfWithin
            </span>
            <div className="h-px w-10" style={{ background: "var(--loader-hairline)" }} />
          </div>
          <p
            className="text-xs font-sans uppercase"
            style={{ color: "var(--loader-tagline)", letterSpacing: "0.18em" }}
          >
            Know Scripture. Know Yourself.
          </p>
        </div>

        {/* Cross — logo-branded gradient */}
        <div
          className="relative flex items-center justify-center"
          style={{
            opacity: bloomReady ? 1 : 0,
            transform: bloomReady ? "translateY(0) scale(1)" : "translateY(18px) scale(0.9)",
            transition: "opacity 1.3s ease 0.55s, transform 1.3s ease 0.55s",
          }}
        >
          {/* Warm glow behind cross — theme-aware */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "100px",
              height: "100px",
              background: "radial-gradient(circle, var(--loader-glow) 0%, transparent 70%)",
              filter: "blur(14px)",
              animation: "sw-breathe 4s ease-in-out infinite",
            }}
          />
          {/* Inner close glow — coral */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "60px",
              height: "60px",
              background: "radial-gradient(circle, oklch(0.72 0.14 25 / 0.15) 0%, transparent 70%)",
              filter: "blur(6px)",
              animation: "sw-breathe 4s ease-in-out 0.5s infinite",
            }}
          />

          <svg
            width="52"
            height="66"
            viewBox="0 0 52 66"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: "sw-breathe 4s ease-in-out infinite",
              filter: "drop-shadow(0 14px 32px oklch(0.92 0.12 45 / 0.55))",
            }}
            aria-hidden="true"
          >
            <defs>
              {/* Gradient: primary-light (peach) → coral → amber — matches logo */}
              <linearGradient
                id="crossGrad"
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
                id="crossHighlight"
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
            <rect x="22" y="0" width="8" height="66" rx="4" fill="url(#crossGrad)" />
            {/* Horizontal beam */}
            <rect x="0" y="18" width="52" height="8" rx="4" fill="url(#crossHighlight)" />
            {/* Inner shimmer highlight */}
            <rect x="24" y="0" width="3" height="66" rx="2" fill="oklch(0.99 0.04 80 / 0.3)" />
            <rect x="0" y="20" width="52" height="3" rx="2" fill="oklch(0.99 0.04 80 / 0.3)" />
          </svg>
        </div>

        {/* Word cycle / verse */}
        <div className="h-24 flex items-center justify-center" aria-live="polite">
          {phase === "bloom" || phase === "words" ? (
            <p
              className="font-serif text-5xl font-medium text-center"
              style={{
                color: "var(--loader-words)",
                opacity: wordVisible ? 1 : 0,
                transform: wordVisible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.97)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
                letterSpacing: "-0.01em",
              }}
            >
              {WORDS[wordIndex]}
            </p>
          ) : (
            <div
              className="text-center flex flex-col items-center gap-3"
              style={{
                opacity: verseVisible ? 1 : 0,
                transform: verseVisible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
              }}
            >
              <p
                className="font-serif text-lg leading-relaxed text-balance"
                style={{ color: "var(--loader-verse)", maxWidth: "360px" }}
              >
                &ldquo;{WELCOME_VERSE.text}&rdquo;
              </p>
              <p
                className="font-sans text-xs uppercase tracking-[0.22em]"
                style={{ color: "var(--loader-verse-ref)" }}
              >
                — {WELCOME_VERSE.ref}
              </p>
            </div>
          )}
        </div>

        {/* Progress bar — peach → coral gradient */}
        <div
          className="flex flex-col items-center gap-2 w-full"
          style={{
            opacity: phase === "verse" || phase === "exit" ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          <div
            className="w-full max-w-[200px] rounded-full overflow-hidden"
            style={{ height: "1px", background: "var(--loader-progress-track)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, var(--loader-progress-fill-0), var(--loader-progress-fill-1))",
                transition: "width 0.06s linear",
                boxShadow: "0 0 8px oklch(0.72 0.14 25 / 0.6)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom vignette — theme-aware */}
      <div className="landing-loader-vignette absolute bottom-0 left-0 right-0 h-32 pointer-events-none" />

      <style>{`
        @keyframes sw-float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33%       { transform: translateY(-20px) translateX(7px); }
          66%       { transform: translateY(-9px) translateX(-5px); }
        }
        @keyframes sw-breathe {
          0%, 100% { opacity: 0.72; transform: scale(1); }
          50%       { opacity: 1;    transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
